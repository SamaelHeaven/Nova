import {Component} from "./Component.js";
import {morphdom} from "./morphdom.js";

export class Application {
    /** @internal */
    private static _instance: Application | null = null;
    /** @internal */
    private readonly _componentDefinitions: { name: string, class: (new (...args: any[]) => Component) }[];
    /** @internal */
    private readonly _morphdomOptions: object;
    /** @internal */
    private readonly _eventNames: string[];

    private constructor() {
        this._componentDefinitions = [];
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromElement: { isEqualNode: (arg0: any) => any; }, toElement: any) {
                return !fromElement.isEqualNode(toElement);
            }
        };
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
    }

    public static launch(componentClasses: (new (...args: any[]) => Component)[]): void {
        const app: Application = this._getInstance();
        for (const componentClass of componentClasses) {
            app._componentDefinitions.push({
                name: Application._getComponentName(componentClass),
                class: componentClass
            });
        }

        app._updateElement(document.documentElement);
    }

    public static update(component: Component): void {
        Application._throwIfUninitialized();
        if ((component.element as any).component !== component) {
            return;
        }

        Application._getInstance()._updateComponent(component);
    }

    public static getComponentById<T extends Component>(id: string): T | null {
        Application._throwIfUninitialized();
        return (document.getElementById(id) as any).component ?? null;
    }

    public static getComponentByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T | null {
        Application._throwIfUninitialized();
        const name: string = Application._getComponentName(clazz);
        const element: HTMLElement = document.querySelector(name);
        if (!element) {
            return null;
        }

        return (element as any).component ?? null;
    }

    public static getComponentsByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T[] {
        Application._throwIfUninitialized();
        const name: string = Application._getComponentName(clazz);
        const elements: HTMLElement[] = Array.from(document.querySelectorAll(name));
        const result: T[] = [];
        for (const element of elements) {
            if ((element as any).component) {
                result.push((element as any).component);
            }
        }

        return result;
    }

    /** @internal */
    private static _getInstance(): Application {
        return Application._instance ??= new Application();
    }

    /** @internal */
    private static _getComponentName<T extends Component>(clazz: (new (...args: any[]) => T)): string {
        const className: string = clazz.name;
        let result: string = '';
        for (let i = 0; i < className.length; i++) {
            if (i > 0 && className[i] === className[i].toUpperCase()) {
                result += '-';
            }
            result += className[i].toLowerCase();
        }

        return result;
    }

    /** @internal */
    private static _throwIfUninitialized(): void {
        if (Application._instance === null) {
            throw new Error("Application has not been launched");
        }
    }

    /** @internal */
    private _updateElement(root: HTMLElement): void {
        for (const componentDefinition of this._componentDefinitions) {
            for (const element of Array.from(root.querySelectorAll(componentDefinition.name)) as HTMLElement[]) {
                if ((element as any).component) {
                    continue;
                }

                if (!element.id || document.querySelectorAll(`#${element.id}`).length > 1) {
                    throw new Error("Components must have an unique id");
                }

                const existingElement: HTMLElement = document.getElementById(element.id);
                let component: Component;
                if (!existingElement || !(existingElement as any).component) {
                    component = new componentDefinition.class(element);
                    this._registerEventListeners(component);
                    (element as any).component = component;
                    component.onInit();
                } else {
                    component = (existingElement as any).component;
                }

                const renderedContent: string | null = component.render();
                if (renderedContent !== null) {
                    element.innerHTML = renderedContent;
                }

                this._updateElement(element);
            }
        }
    }

    /** @internal */
    private _registerEventListeners(component: Component): void {
        for (const key of component.getKeys()) {
            const eventType: string = key.substring(2).toLowerCase();
            if (this._eventNames.indexOf(eventType) !== -1) {
                component.element.addEventListener(eventType, (event: Event) => {
                    (component as any)[key](event);
                });
            }
        }
    }

    /** @internal */
    private _updateComponent(component: Component): void {
        const newElement: HTMLElement = component.element.cloneNode(false) as HTMLElement;
        const renderedContent: string | null = component.render();
        if (renderedContent === null) {
            return;
        }

        newElement.innerHTML = component.render();
        this._updateElement(newElement);
        morphdom(component.element, newElement, this._morphdomOptions);
    }
}