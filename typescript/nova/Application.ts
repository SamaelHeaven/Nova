import {Component} from "./Component.js";
import {morphdom} from "./morphdom.js";
import {ComponentDefinition} from "./ComponentDefinition.js";
import {formatDate} from "./formatDate.js";

declare global {
    interface Date {
        format(format: string): string;
    }

    interface HTMLElement {
        appComponent?: { instance: Component, dirty: boolean };
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

    public static launch(componentDefinitions: ComponentDefinition[]): void {
        if (this._instance !== null) {
            throw new Error("Application has already been launched");
        }

        const app: Application = this._getInstance();
        app._initializeComponents([...new Set(componentDefinitions)]);
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
        return (element.querySelector(selector) as HTMLElement)?.appComponent?.instance as T || null;
    }

    public static queryComponents<T extends Component>(selector: string, element: HTMLElement = document.documentElement): T[] {
        this._throwIfUninitialized();
        const components: T[] = [];
        for (const foundElement of Array.from(element.querySelectorAll(selector))) {
            const component: Component | undefined = (foundElement as HTMLElement).appComponent?.instance;
            if (component) {
                components.push(component as T);
            }
        }

        return components;
    }

    public static closestComponent<T extends Component>(selector: string, element: HTMLElement): T | null {
        this._throwIfUninitialized();
        const foundElement: HTMLElement = element.closest(selector);
        if (!foundElement) {
            return null;
        }

        const component: Component | undefined = foundElement.appComponent?.instance;
        if (component) {
            return component as T;
        }

        return this.closestComponent(selector, foundElement.parentElement);
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
            const appComponent: { instance: Component, dirty: boolean } | undefined = element.appComponent;
            if (appComponent && appComponent.dirty) {
                appComponent.dirty = false;
                this._onElementUpdated(element);
            }
        }
    }

    /** @internal */
    private _onBeforeElementUpdated(fromElement: HTMLElement, toElement: HTMLElement): boolean {
        const component: Component | undefined = fromElement.appComponent?.instance;
        if (component && component.initialized && component.keys.includes("render")) {
            toElement.innerHTML = component.shouldUpdate ? component.render() : fromElement.innerHTML;
            toElement.style.display = "contents";
            toElement.setAttribute("data-uuid", component.uuid);
            if (component.shouldUpdate) {
                const morphResult: void | boolean = component.onMorph(toElement);
                fromElement.appComponent.dirty = true;
                if (morphResult === false) {
                    return false;
                }
            }
        }

        return !fromElement.isEqualNode(toElement);
    }

    /** @internal */
    private _onElementUpdated(element: HTMLElement): void {
        const component: Component | undefined = element.appComponent?.instance;
        if (component && component.appeared) {
            component.onUpdate();
        }
    }

    /** @internal */
    private _initializeComponents(componentDefinitions: ComponentDefinition[]): void {
        for (const component of componentDefinitions) {
            this._initializeComponent(component);
        }
    }

    /** @internal */
    private _initializeComponent(componentDefinition: ComponentDefinition): void {
        const app = this;

        class ComponentElement extends HTMLElement {
            public connectedCallback(): void {
                this.style.display = "contents";
                this.appComponent = {instance: new componentDefinition.ctor(this), dirty: false};
                this.setAttribute("data-uuid", this.appComponent.instance.uuid);
                const initResult: void | Promise<void> = this.appComponent.instance.onInit();
                if (initResult instanceof Promise) {
                    initResult.then(() => app._initializeElement(this));
                    return;
                }

                app._initializeElement(this);
            }

            public disconnectedCallback(): void {
                this.appComponent.instance.onDestroy();
            }
        }

        customElements.define(componentDefinition.tag, ComponentElement);
    }

    /** @internal */
    private _initializeElement(element: HTMLElement): void {
        const component: Component = element.appComponent.instance;
        (component as any).initialized = true;
        this._observeAttributes(component);
        this.registerComponentEvents(component);
        this._updateComponent(component);
        component.onAppear();
        (component as any).appeared = true;
    }

    /** @internal */
    private _initializeEvents(): void {
        for (const eventName of this._eventNames) {
            document.documentElement.addEventListener(eventName, (event: Event) => this._onEvent(event, event.target as HTMLElement));
        }
    }

    /** @internal */
    private _onEvent(event: Event, element: HTMLElement): void {
        this._handleEvent(event, element);
        this._handleBind(event);
    }

    /** @internal */
    private _handleEvent(event: Event, element: HTMLElement): void {
        const eventElement: HTMLElement = element.closest(`[data-on-${event.type}]`);
        if (!eventElement) {
            return;
        }

        const [uuid, call] = eventElement.getAttribute(`data-on-${event.type}`).split(";");
        const component: Component = (eventElement.closest(`[data-uuid="${uuid}"]`) as HTMLElement).appComponent.instance;
        if (component[call](event) !== false) {
            this._handleEvent(event, eventElement.parentElement);
        }
    }

    /** @internal */
    private _handleBind(event: Event): void {
        if (event.type !== "input") {
            return;
        }

        const bindElement: HTMLInputElement = event.target as HTMLInputElement;
        const binding: string | null = bindElement.getAttribute("data-bind");
        if (!binding) {
            return;
        }

        const [uuid, key] = binding.split(";");
        let value: string | undefined | null = bindElement.value;
        if (value === undefined || value === null) {
            value = bindElement.getAttribute("value");
        }

        if (value !== undefined && value !== null) {
            const component: Component = (bindElement.closest(`[data-uuid="${uuid}"]`) as HTMLElement).appComponent.instance;
            component[key] = value;
        }
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