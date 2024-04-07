import {Component} from "./Component.js";
import {morphdom} from "./morphdom.js";

export class Application {
    /** @internal */
    private static _instance: Application | null = null;
    /** @internal */
    private readonly _components: { name: string, ctor: (new (...args: any[]) => Component) }[];
    /** @internal */
    private readonly _morphdomOption: object;
    /** @internal */
    private readonly _eventNames: string[] = [
        "click",
        "dblclick",
        "mousedown",
        "mouseup",
        "mousemove",
        "mouseenter",
        "mouseleave",
        "mouseover",
        "mouseout",
        "keydown",
        "keypress",
        "keyup",
        "focus",
        "blur",
        "input",
        "change",
        "submit",
        "scroll",
        "error",
        "resize",
        "select",
        "touchstart",
        "touchmove",
        "touchend",
        "touchcancel",
        "animationstart",
        "animationend",
        "animationiteration",
        "transitionstart",
        "transitionend",
        "transitioncancel"
    ];

    private constructor() {
        this._components = [];
        this._morphdomOption = {
            onBeforeElUpdated: function (fromElement: { isEqualNode: (arg0: any) => any; }, toElement: any) {
                return !fromElement.isEqualNode(toElement);
            }
        };
    }

    public static launch(components: (new (...args: any[]) => Component)[]): void {
        const app: Application = this._getInstance();
        for (const component of components) {
            app._components.push({
                name: Application._getComponentName(component.name),
                ctor: component
            });
        }

        app._updateElement(document.documentElement);
    }

    public static update(component: Component): void {
        if (Application._instance === null) {
            return;
        }

        Application._getInstance()._updateComponent(component);
    }

    public static getComponent<T extends Component>(clazz: (new (...args: any[]) => T)): T | null {
        if (Application._instance === null) {
            return null;
        }

        const name: string = Application._getComponentName(clazz.name);
        const element: HTMLElement = document.querySelector(name);
        if (!element) {
            return null;
        }

        return (element as any).component ?? null;
    }

    public static getComponents<T extends Component>(clazz: (new (...args: any[]) => T)): T[] {
        if (Application._instance === null) {
            return [];
        }

        const name: string = Application._getComponentName(clazz.name);
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
    private static _getComponentName(input: string): string {
        let result: string = '';
        for (let i = 0; i < input.length; i++) {
            if (i > 0 && input[i] === input[i].toUpperCase()) {
                result += '-';
            }
            result += input[i].toLowerCase();
        }

        return result;
    }

    /** @internal */
    private _updateElement(root: HTMLElement): void {
        const components: Component[] = [];
        for (const component of this._components) {
            for (const element of Array.from(root.querySelectorAll(component.name)) as HTMLElement[]) {
                const loaded: Attr = element.attributes.getNamedItem("nova-loaded");
                if (loaded && loaded.value === "true") {
                    continue;
                }

                element.setAttribute("nova-loaded", "true");
                element.style.display = "inline-block";
                element.style.width = "fit-content";
                element.style.height = "fit-content";
                const componentInstance: Component = new component.ctor(element);
                components.push(componentInstance);
                this._registerEventListeners(componentInstance);
                (element as any).component = componentInstance;
                element.innerHTML = componentInstance.render();
            }
        }

        for (const component of components) {
            component.onStart();
        }
    }

    /** @internal */
    private _registerEventListeners(componentInstance: Component): void {
        for (const key of componentInstance.getKeys()) {
            const eventType: string = key.substring(2).toLowerCase();
            if (this._eventNames.indexOf(eventType) !== -1) {
                componentInstance.element.addEventListener(eventType, (event: Event) => {
                    (componentInstance as any)[key](event);
                });
            }
        }
    }

    /** @internal */
    private _updateComponent(component: Component): void {
        const newElement: HTMLElement = component.element.cloneNode(false) as HTMLElement;
        newElement.innerHTML = component.render();
        morphdom(component.element, newElement, this._morphdomOption);
        this._updateElement(component.element);
    }
}