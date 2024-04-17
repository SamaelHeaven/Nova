import {Component} from "./Component.js";
import {morphdom} from "./morphdom.js";
import {ComponentDefinition} from "./ComponentDefinition.js";
import {formatDate} from "./formatDate.js";

declare global {
    interface Date {
        format(format: string): string;
    }

    /** @internal */
    interface HTMLElement {
        component?: Component;
        dirty?: boolean;
    }
}

Date.prototype.format = formatDate;

export class Application {
    /** @internal */
    private static _instance: Application | null = null;
    /** @internal */
    private readonly _eventNames: string[];
    /** @internal */
    private readonly _morphdomOptions: object;

    private constructor() {
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
        this._morphdomOptions = {
            onBeforeElUpdated: (fromEl: HTMLElement, toEl: HTMLElement): boolean => this._onBeforeElementUpdated(fromEl, toEl)
        };
    }

    public static launch(components: ComponentDefinition[]): void {
        if (this._instance !== null) {
            throw new Error("Application has already been launched");
        }

        const app: Application = this._getInstance();
        app._initializeComponents([...new Set(components)]);
        app._initializeEvents();
    }

    public static updateComponent(component: Component): void {
        this._throwIfUninitialized();
        if (component.shouldUpdate) {
            this._getInstance()._updateComponent(component);
        }
    }

    public static queryComponent<T extends Component>(selector: string, element: HTMLElement = document.documentElement): T | null {
        this._throwIfUninitialized();
        return (element.querySelector(selector) as HTMLElement)?.component as T || null;
    }

    public static queryComponents<T extends Component>(selector: string, element: HTMLElement = document.documentElement): T[] {
        this._throwIfUninitialized();
        const components: T[] = [];
        for (const foundElement of Array.from(element.querySelectorAll(selector))) {
            const component: Component | undefined = (foundElement as HTMLElement).component;
            if (component) {
                components.push(component as T);
            }
        }

        return components;
    }

    /** @internal */
    private static _getInstance(): Application {
        return this._instance ??= new Application();
    }

    /** @internal */
    private static _throwIfUninitialized(): void {
        if (this._instance === null) {
            throw new Error("Application has not been launched");
        }
    }

    /** @internal */
    private registerComponentEvents(component: Component): void {
        for (const key of component.keys) {
            const eventType: string = key.substring(2).toLowerCase();
            if (this._eventNames.includes(eventType)) {
                component.element.addEventListener(eventType, (event: Event): any => {
                    return component[key](event);
                });
            }
        }
    }

    /** @internal */
    private _updateComponent(component: Component): void {
        if (!component.initialized || !component.keys.includes("render")) {
            return;
        }

        const newElement: HTMLElement = component.element.cloneNode(false) as HTMLElement;
        morphdom(component.element, newElement, this._morphdomOptions);
        for (const element of Array.from(component.element.parentElement.querySelectorAll("*")) as HTMLElement[]) {
            if (element.dirty === true) {
                element.dirty = false;
                this._onElementUpdated(element);
            }
        }
    }

    /** @internal */
    private _onBeforeElementUpdated(fromElement: HTMLElement, toElement: HTMLElement): boolean {
        const component: Component | undefined = fromElement.component;
        if (component && component.initialized && component.keys.includes("render")) {
            if (!component.shouldUpdate) {
                return false;
            }

            toElement.innerHTML = component.render();
            toElement.style.display = "contents";
            toElement.setAttribute("data-uuid", component.uuid);
            const morphResult: void | boolean = component.onMorph(toElement);
            fromElement.dirty = true;
            if (morphResult === false) {
                return false;
            }
        }

        return !fromElement.isEqualNode(toElement);
    }

    /** @internal */
    private _onElementUpdated(element: HTMLElement): void {
        const component: Component | undefined = element.component;
        if (component && component.appeared) {
            component.onUpdate();
        }
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
            public connectedCallback(): void {
                this.style.display = "contents";
                this.component = new component.ctor(this);
                this.setAttribute("data-uuid", this.component.uuid);
                const initResult: void | Promise<void> = this.component.onInit();
                if (initResult instanceof Promise) {
                    initResult.then(() => app._initializeElement(this));
                    return;
                }

                app._initializeElement(this);
            }

            public disconnectedCallback(): void {
                this.component.onDestroy();
            }
        }

        customElements.define(component.tag, ComponentElement);
    }

    /** @internal */
    private _initializeElement(element: HTMLElement): void {
        (element.component as any).initialized = true;
        this._observeAttributes(element.component);
        this.registerComponentEvents(element.component);
        this._updateComponent(element.component);
        element.component.onAppear();
        (element.component as any).appeared = true;
    }

    /** @internal */
    private _initializeEvents(): void {
        for (const eventName of this._eventNames) {
            document.documentElement.addEventListener(eventName, (event: Event) => this._onEvent(event, event.target as HTMLElement));
        }
    }

    /** @internal */
    private _onEvent(event: Event, element: HTMLElement): any {
        const eventElement: Element = element.closest("[data-event]");
        if (!eventElement) {
            return;
        }

        const [uuid, type, call] = eventElement.getAttribute("data-event").split(";");
        if (event.type !== type) {
            return;
        }

        const component: Component = (eventElement.closest(`[data-uuid="${uuid}"]`) as HTMLElement).component;
        component[call](event);
        this._onEvent(event, eventElement.parentElement);
    }

    /** @internal */
    private _observeAttributes(component: Component): void {
        if (!component.keys.includes("onAttributeChanged")) {
            return;
        }

        const observerConfig: MutationObserverInit = {attributes: true, attributeOldValue: true, subtree: false};
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