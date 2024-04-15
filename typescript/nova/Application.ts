import {Component} from "./Component.js";
import {morphdom} from "./morphdom.js";
import {ComponentDefinition} from "./ComponentDefinition.js";
import {Html} from "./Html.js";
import {formatDate} from "./formatDate.js";

declare global {
    interface String {
        html(): Html;
    }

    interface Date {
        format(format: string): string;
    }

    /** @internal */
    interface Element {
        appComponent?: Component;
        appComponentDirty?: boolean;
        appComponentEvents?: [string, ((event: Event) => any)][];
    }
}

String.prototype.html = function (): Html {
    return new Html(this);
}

Date.prototype.format = formatDate;

export class Application {
    /** @internal */
    private static _instance: Application | null = null;
    /** @internal */
    private readonly _morphdomOptions: object;

    private constructor() {
        const app = this;
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromEl: HTMLElement, toEl: HTMLElement): boolean {
                return app._onBeforeElementUpdated(fromEl, toEl)
            }
        };
    }

    public static launch(components: ComponentDefinition[]): void {
        if (this._instance !== null) {
            throw new Error("Application has already been launched");
        }

        const app: Application = this._getInstance();
        app._initializeComponents([...new Set(components)]);
    }

    public static updateComponent(component: Component): void {
        this._throwIfUninitialized();
        this._getInstance()._updateComponent(component);
    }

    public static queryComponent<T extends Component>(selector: string, element: HTMLElement = document.documentElement): T | null {
        this._throwIfUninitialized();
        return element.querySelector(selector)?.appComponent as T || null;
    }

    public static queryComponents<T extends Component>(selector: string, element: HTMLElement = document.documentElement): T[] {
        this._throwIfUninitialized();
        const components: T[] = [];
        for (const foundElement of Array.from(element.querySelectorAll(selector))) {
            const component = foundElement.appComponent;
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
    private _updateComponent(component: Component): void {
        const newElement: HTMLElement = component.element.cloneNode(false) as HTMLElement;
        if (!component.getKeys().includes("render")) {
            return;
        }

        morphdom(component.element, newElement, this._morphdomOptions);
        for (const foundComponent of Application.queryComponents("*", component.element.parentElement)) {
            if (foundComponent.element.appComponentDirty) {
                foundComponent.element.appComponentDirty = false;
                foundComponent.onUpdate();
            }
        }
    }

    /** @internal */
    private _onBeforeElementUpdated(fromElement: HTMLElement, toElement: HTMLElement): boolean {
        const component: Component = fromElement.appComponent;
        if (!component) {
            return !fromElement.isEqualNode(toElement);
        }

        const html: Html = component.render();
        if (html instanceof Html) {
            toElement.innerHTML = "";
            toElement.style.display = "contents";
            if (fromElement.appComponentEvents) {
                for (const [type, callback] of fromElement.appComponentEvents) {
                    fromElement.removeEventListener(type, callback);
                }

                fromElement.appComponentEvents = [];
            }

            toElement.appendChild(html.build(fromElement));
            component.onMorph(toElement);
            if (!fromElement.isEqualNode(toElement)) {
                fromElement.appComponentDirty = true;
                return true;
            }

            return false;
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
                this.appComponent = new component.ctor(this);
                app._observeAttributes(this.appComponent);
                (async (): Promise<void> => {
                    await this.appComponent.onInit();
                    app._updateComponent(this.appComponent);
                    this.appComponent.onAppear();
                })();
            }

            public disconnectedCallback(): void {
                this.appComponent.onDestroy();
            }
        }

        customElements.define(component.tag, ComponentElement);
    }

    /** @internal */
    private _observeAttributes(component: Component): void {
        if (!component.getKeys().includes("onAttributeChanged")) {
            return;
        }

        const observerConfig: MutationObserverInit = {attributes: true, attributeOldValue: true, subtree: false};
        const observer: MutationObserver = new MutationObserver((mutationsList: MutationRecord[], _: MutationObserver): void => {
            for (const mutation of mutationsList) {
                if (mutation.type === "attributes") {
                    component.onAttributeChanged(mutation.attributeName, mutation.oldValue, component.element.getAttribute(mutation.attributeName))
                }
            }
        });

        observer.observe(component.element, observerConfig);
    }
}