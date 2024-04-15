import { morphdom } from "./morphdom.js";
import { Html } from "./Html.js";
import { formatDate } from "./formatDate.js";
String.prototype.html = function () {
    return new Html(this);
};
Date.prototype.format = formatDate;
export class Application {
    constructor() {
        const app = this;
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromEl, toEl) {
                return app._onBeforeElementUpdated(fromEl, toEl);
            }
        };
    }
    static launch(components) {
        if (this._instance !== null) {
            throw new Error("Application has already been launched");
        }
        const app = this._getInstance();
        app._initializeComponents([...new Set(components)]);
    }
    static updateComponent(component) {
        this._throwIfUninitialized();
        this._getInstance()._updateComponent(component);
    }
    static queryComponent(selector, element = document.documentElement) {
        var _a;
        this._throwIfUninitialized();
        return ((_a = element.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.component) || null;
    }
    static queryComponents(selector, element = document.documentElement) {
        this._throwIfUninitialized();
        const components = [];
        for (const foundElement of Array.from(element.querySelectorAll(selector))) {
            const component = foundElement.component;
            if (component) {
                components.push(component);
            }
        }
        return components;
    }
    static _getInstance() {
        var _a;
        return (_a = this._instance) !== null && _a !== void 0 ? _a : (this._instance = new Application());
    }
    static _throwIfUninitialized() {
        if (this._instance === null) {
            throw new Error("Application has not been launched");
        }
    }
    _updateComponent(component) {
        const newElement = component.element.cloneNode(false);
        if (!component.getKeys().includes("render")) {
            return;
        }
        morphdom(component.element, newElement, this._morphdomOptions);
        for (const foundComponent of Application.queryComponents("*", component.element.parentElement)) {
            if (foundComponent.element.isDirty) {
                foundComponent.element.isDirty = false;
                foundComponent.onUpdate();
            }
        }
    }
    _onBeforeElementUpdated(fromElement, toElement) {
        const component = fromElement.component;
        if (!component) {
            return !fromElement.isEqualNode(toElement);
        }
        const html = component.render();
        if (html instanceof Html) {
            toElement.innerHTML = "";
            toElement.style.display = "contents";
            for (const key of Object.keys(HTMLElement.prototype)) {
                if (key.startsWith("on")) {
                    fromElement[key] = null;
                }
            }
            toElement.appendChild(html.build(fromElement));
            component.onMorph(toElement);
            if (!fromElement.isEqualNode(toElement)) {
                fromElement.isDirty = true;
                return true;
            }
            return false;
        }
    }
    _initializeComponents(components) {
        for (const component of components) {
            this._initializeComponent(component);
        }
    }
    _initializeComponent(component) {
        const app = this;
        class ComponentElement extends HTMLElement {
            connectedCallback() {
                this.component = new component.ctor(this);
                app._observeAttributes(this.component);
                (async () => {
                    await this.component.onInit();
                    app._updateComponent(this.component);
                    this.component.onAppear();
                })();
            }
            disconnectedCallback() {
                this.component.onDestroy();
            }
        }
        customElements.define(component.tag, ComponentElement);
    }
    _observeAttributes(component) {
        if (!component.getKeys().includes("onAttributeChanged")) {
            return;
        }
        const observerConfig = { attributes: true, attributeOldValue: true, subtree: false };
        const observer = new MutationObserver((mutationsList, _) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "attributes") {
                    component.onAttributeChanged(mutation.attributeName, mutation.oldValue, component.element.getAttribute(mutation.attributeName));
                }
            }
        });
        observer.observe(component.element, observerConfig);
    }
}
Application._instance = null;
