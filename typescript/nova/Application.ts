import {Component} from "./Component.js";
import {morphdom} from "./morphdom.js";
import {Validation} from "./Validation.js";
import {ComponentDefinition} from "./ComponentDefinition.js";

export class Application {
    /** @internal */
    private static _instance: Application | null = null;
    /** @internal */
    private readonly _eventNames: string[];
    /** @internal */
    private readonly _morphdomOptions: object;

    private constructor() {
        const app = this;
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromEl: HTMLElement, toEl: HTMLElement): boolean {
                return app._onBeforeElementUpdated(fromEl, toEl)
            }
        };
    }

    public static launch(components: ComponentDefinition[]): void {
        if (Application._instance !== null) {
            throw new Error("Application has already been launched");
        }

        const app: Application = Application._getInstance();
        app._initializeComponents([...components]);
    }

    public static updateComponent(component: Component): void {
        Application._throwIfUninitialized();
        Application._getInstance()._updateComponent(component);
    }

    public static queryComponent<T extends Component>(selector: string, element: HTMLElement = document.documentElement): T | null {
        return (element.querySelector(selector) as any)?.component || null;
    }

    public static queryComponents<T extends Component>(selector: string, element: HTMLElement = document.documentElement): T[] {
        const components: T[] = [];
        for (const foundElement of Array.from(element.querySelectorAll(selector))) {
            const component = (foundElement as any).component;
            if (component) {
                components.push(component);
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

        morphdom(component.element, newElement, this._morphdomOptions);
    }

    /** @internal */
    private _onBeforeElementUpdated(fromElement: HTMLElement, toElement: HTMLElement): boolean {
        const component = (fromElement as any).component;
        if (component) {
            const renderedContent = component.render();
            if (!Validation.isNullOrUndefined(renderedContent)) {
                toElement.innerHTML = renderedContent;
                component.onRender();
            }
        }

        return !fromElement.isEqualNode(toElement);
    }

    /** @internal */
    private _initializeComponents(components: ComponentDefinition[]): void {
        for (const component of components) {
            this._initializeComponent(component);
        }
    }

    /** @internal */
    private _initializeComponent(component: ComponentDefinition): void {
        const app = this;

        class ComponentElement extends HTMLElement {
            public component: Component;

            public connectedCallback(): void {
                this.component = new component.constructor(this);
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

        customElements.define(component.tagName, ComponentElement);
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
}