import {Component} from "./Component.js";
import {morphdom} from "./morphdom.js";
import {Validation} from "./Validation.js";

export class Application {
    /** @internal */
    private static _instance: Application | null = null;
    /** @internal */
    private readonly _morphdomOptions: object;
    /** @internal */
    private readonly _eventNames: string[];
    /** @internal */
    private _components: { name: string, class: (new (element: HTMLElement) => Component) }[];

    private constructor() {
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromElement: {
                isEqualNode: (arg: any) => any;
            }, toElement: any) {
                return !fromElement.isEqualNode(toElement);
            }
        };

        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
        this._components = [];
    }

    public static launch(components: { name: string, class: (new (element: HTMLElement) => Component) }[]): void {
        if (Application._instance !== null) {
            throw new Error("Application has already been launched");
        }

        const app: Application = Application._getInstance();
        app._components = [...components];
        app._initializeComponents();
    }

    public static updateComponent(component: Component): void {
        Application._throwIfUninitialized();
        Application._getInstance()._updateComponent(component);
    }

    public static getComponent<T extends Component>(component: (new (element: HTMLElement) => T), element: HTMLElement = document.documentElement): T | null {
        Application._throwIfUninitialized();
        const name: string = Application._getInstance()._components.find(c => c.class == component).name;
        return (element.getElementsByTagName(name) as any)?.component || null;
    }

    public static getComponents<T extends Component>(component: (new (element: HTMLElement) => T), element: HTMLElement = document.documentElement): T[] {
        Application._throwIfUninitialized();
        const name: string = Application._getInstance()._components.find(c => c.class == component).name;
        const components: T[] = [];
        for (const componentElement of Array.from(element.getElementsByTagName(name))) {
            if ((componentElement as any).component) {
                components.push((componentElement as any).component);
            }
        }

        return components;
    }

    /** @internal */
    private static _getInstance(): Application {
        return Application._instance ??= new Application();
    }

    /** @internal */
    private static _throwIfUninitialized(): void {
        if (Application._instance === null) {
            throw new Error("Application has not been launched");
        }
    }

    /** @internal */
    private _registerEventListeners(component: Component): void {
        for (const key of component.getKeys()) {
            const eventType: string = key.substring(2).toLowerCase();
            if (this._eventNames.includes(eventType)) {
                component.element.addEventListener(eventType, (event: Event): void => {
                    (component as any)[key](event);
                });
            }
        }
    }

    /** @internal */
    private _updateComponent(component: Component): void {
        const newElement: HTMLElement = component.element.cloneNode(false) as HTMLElement;
        const renderedContent: string | undefined = component.render();
        if (Validation.isNullOrUndefined(renderedContent)) {
            return;
        }

        newElement.innerHTML = component.render();
        morphdom(component.element, newElement, this._morphdomOptions);
        component.onRender();
    }

    /** @internal */
    private _initializeComponents(): void {
        for (const component of this._components) {
            this._initializeComponent(component);
        }
    }

    /** @internal */
    private _observeAttributes(component: Component): void {
        const observerConfig: MutationObserverInit = {attributes: true, subtree: false};
        const observer: MutationObserver = new MutationObserver((mutationsList: MutationRecord[], _: MutationObserver): void => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    component.onAttributeChanged(mutation.attributeName, mutation.oldValue, component.element.getAttribute(mutation.attributeName))
                }
            }
        });

        observer.observe(component.element, observerConfig);
    }

    /** @internal */
    private _initializeComponent(component: { name: string, class: (new (element: HTMLElement) => Component) }): void {
        const app = this;

        class ComponentElement extends HTMLElement {
            public component: Component;

            public connectedCallback(): void {
                this.component = new component.class(this);
                app._observeAttributes(this.component);
                app._registerEventListeners(this.component);
                this.component.onInit();
                app._updateComponent(this.component);
                this.component.onAppear();
            }

            public disconnectedCallback(): void {
                this.component.onDestroy();
            }
        }

        customElements.define(component.name, ComponentElement);
    }
}