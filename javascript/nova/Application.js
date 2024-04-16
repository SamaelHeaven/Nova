import { morphdom } from "./morphdom.js";
import { formatDate } from "./formatDate.js";
Date.prototype.format = formatDate;
export class Application {
    constructor() {
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
        this._morphdomOptions = {
            onBeforeElUpdated: (fromEl, toEl) => this._onBeforeElementUpdated(fromEl, toEl),
            onElUpdated: (el) => this._onElementUpdated(el)
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
    _registerEventListeners(component) {
        for (const key of component.keys) {
            const eventType = key.substring(2).toLowerCase();
            if (this._eventNames.includes(eventType)) {
                component.element.addEventListener(eventType, (event) => {
                    return component[key](event);
                });
            }
        }
    }
    _updateComponent(component) {
        if (!component.initialized || !component.keys.includes("render")) {
            return;
        }
        const newElement = component.element.cloneNode(false);
        morphdom(component.element, newElement, this._morphdomOptions);
    }
    _onBeforeElementUpdated(fromElement, toElement) {
        const component = fromElement.component;
        if (component && component.initialized && component.keys.includes("render")) {
            toElement.innerHTML = component.render();
            toElement.style.display = "contents";
            component.onMorph(toElement);
        }
        return !fromElement.isEqualNode(toElement);
    }
    _onElementUpdated(element) {
        const component = element.component;
        if (component && component.appeared) {
            component.onUpdate();
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
                this.style.display = "contents";
                this.component = new component.ctor(this);
                const initResult = this.component.onInit();
                if (initResult instanceof Promise) {
                    initResult.then(() => app._initializeElement(this));
                    return;
                }
                app._initializeElement(this);
            }
            disconnectedCallback() {
                this.component.onDestroy();
            }
        }
        customElements.define(component.tag, ComponentElement);
    }
    _initializeElement(element) {
        element.component.initialized = true;
        this._observeAttributes(element.component);
        this._registerEventListeners(element.component);
        this._updateComponent(element.component);
        element.component.onAppear();
        element.component.appeared = true;
    }
    _observeAttributes(component) {
        if (!component.keys.includes("onAttributeChanged")) {
            return;
        }
        const observerConfig = { attributes: true, attributeOldValue: true, subtree: false };
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
