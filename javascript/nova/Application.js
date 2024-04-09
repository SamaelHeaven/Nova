import { morphdom } from "./morphdom.js";
import { Validation } from "./Validation.js";
export class Application {
    constructor() {
        const app = this;
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromEl, toEl) {
                return app._onBeforeElementUpdated(fromEl, toEl);
            }
        };
    }
    static launch(components) {
        if (Application._instance !== null) {
            throw new Error("Application has already been launched");
        }
        const app = Application._getInstance();
        app._initializeComponents([...components]);
    }
    static updateComponent(component) {
        Application._throwIfUninitialized();
        Application._getInstance()._updateComponent(component);
    }
    static queryComponent(selector, element = document.documentElement) {
        var _a;
        return ((_a = element.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.component) || null;
    }
    static queryComponents(selector, element = document.documentElement) {
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
        return (_a = Application._instance) !== null && _a !== void 0 ? _a : (Application._instance = new Application());
    }
    static _throwIfUninitialized() {
        if (Application._instance === null) {
            throw new Error("Application has not been launched");
        }
    }
    _registerEventListeners(component) {
        for (const key of component.getKeys()) {
            const eventType = key.substring(2).toLowerCase();
            if (this._eventNames.includes(eventType)) {
                component.element.addEventListener(eventType, (event) => {
                    component[key](event);
                });
            }
        }
    }
    _updateComponent(component) {
        const newElement = component.element.cloneNode(false);
        const renderedContent = component.render();
        if (Validation.isNullOrUndefined(renderedContent)) {
            return;
        }
        morphdom(component.element, newElement, this._morphdomOptions);
    }
    _onBeforeElementUpdated(fromElement, toElement) {
        const component = fromElement.component;
        if (component) {
            const renderedContent = component.render();
            if (!Validation.isNullOrUndefined(renderedContent)) {
                toElement.innerHTML = renderedContent;
                component.onRender();
            }
        }
        return !fromElement.isEqualNode(toElement);
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
                this.component = new component.constructor(this);
                app._observeAttributes(this.component);
                app._registerEventListeners(this.component);
                this.component.onInit();
                app._updateComponent(this.component);
                this.component.onAppear();
            }
            disconnectedCallback() {
                this.component.onDestroy();
            }
        }
        customElements.define(component.tagName, ComponentElement);
    }
    _observeAttributes(component) {
        const observerConfig = { attributes: true, subtree: false };
        const observer = new MutationObserver((mutationsList, _) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    component.onAttributeChanged(mutation.attributeName, mutation.oldValue, component.element.getAttribute(mutation.attributeName));
                }
            }
        });
        observer.observe(component.element, observerConfig);
    }
}
Application._instance = null;
