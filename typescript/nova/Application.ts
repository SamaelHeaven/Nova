import {Component} from "./Component.js";
import {morphdom} from "./morphdom.js";
import {Validation} from "./Validation.js";

export class Application {
    /** @internal */
    private static _instance: Application | null = null;
    /** @internal */
    private readonly _componentDefinitions: { name: string, class: (new (...args: any[]) => Component) }[];
    /** @internal */
    private readonly _morphdomOptions: object;
    /** @internal */
    private readonly _eventNames: string[];
    /** @internal */
    private _updating: boolean;

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
        if (Application._instance !== null) {
            throw new Error("Application has already been launched");
        }

        const app: Application = Application._getInstance();
        for (const componentClass of componentClasses) {
            app._componentDefinitions.push({
                name: Application._getComponentName(componentClass),
                class: componentClass
            });
        }

        app._updating = true;
        app._updateElement(document.documentElement);
        app._updating = false;
    }

    public static updateComponent(component: Component): void {
        Application._throwIfUninitialized();
        if ((component.element as any)?.novaComponent !== component) {
            return;
        }

        const app: Application = Application._getInstance();
        while (app._updating) {
        }
        app._updating = true;
        app._updateComponent(component);
        app._updating = false;
    }

    public static updateElement(element: HTMLElement): void {
        Application._throwIfUninitialized();
        const app: Application = Application._getInstance();
        while (app._updating) {
        }
        app._updating = true;
        const newElement: HTMLElement = element.cloneNode(true) as HTMLElement;
        app._updateElement(newElement);
        morphdom(element, newElement, app._morphdomOptions);
        app._updating = false;
    }

    public static getComponentById<T extends Component>(id: string): T | null {
        Application._throwIfUninitialized();
        return (document.getElementById(id) as any)?.novaComponent || null;
    }

    public static getComponentByClass<T extends Component>(clazz: (new (...args: any[]) => T), element: HTMLElement = document.documentElement): T | null {
        Application._throwIfUninitialized();
        const name: string = Application._getComponentName(clazz);
        return (element.querySelector(name) as any)?.novaComponent || null;
    }

    public static getComponentsByClass<T extends Component>(clazz: (new (...args: any[]) => T), element: HTMLElement = document.documentElement): T[] {
        Application._throwIfUninitialized();
        const name: string = Application._getComponentName(clazz);
        const result: T[] = [];
        for (const componentElement of Array.from(element.querySelectorAll(name))) {
            if ((componentElement as any).novaComponent) {
                result.push((componentElement as any).novaComponent);
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
            for (const element of Array.from(root.getElementsByTagName(componentDefinition.name)) as HTMLElement[]) {
                if (!element.id || document.querySelectorAll(`#${element.id}`).length > 1) {
                    throw new Error("Components must have an unique id");
                }

                const existingElement: HTMLElement = document.getElementById(element.id);
                let component: Component;
                if (!existingElement || !(existingElement as any).novaComponent) {
                    component = new componentDefinition.class(element);
                    this._registerEventListeners(component);
                    (element as any).novaComponent = component;
                    component.onInit();
                } else {
                    component = (existingElement as any).novaComponent;
                }

                const renderedContent: string | null | undefined = component.render();
                if (!Validation.isNullOrUndefined(renderedContent)) {
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
        const renderedContent: string | null | undefined = component.render();
        if (Validation.isNullOrUndefined(renderedContent)) {
            return;
        }

        newElement.innerHTML = component.render();
        this._updateElement(newElement);
        morphdom(component.element, newElement, this._morphdomOptions);
    }
}