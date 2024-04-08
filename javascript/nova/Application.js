import { morphdom } from "./morphdom.js";
import { Validation } from "./Validation.js";
export class Application {
    constructor() {
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromElement, toElement) {
                return !fromElement.isEqualNode(toElement);
            }
        };
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
        this._components = [];
    }
    static launch(components) {
        if (Application._instance !== null) {
            throw new Error("Application has already been launched");
        }
        const app = Application._getInstance();
        app._components = [...components];
        app._initializeComponents();
    }
    static updateComponent(component) {
        Application._throwIfUninitialized();
        Application._getInstance()._updateComponent(component);
    }
    static getComponent(component, element = document.documentElement) {
        var _a;
        Application._throwIfUninitialized();
        const name = Application._getInstance()._components.find(c => c.class == component).name;
        return ((_a = element.getElementsByTagName(name)) === null || _a === void 0 ? void 0 : _a.component) || null;
    }
    static getComponents(component, element = document.documentElement) {
        Application._throwIfUninitialized();
        const name = Application._getInstance()._components.find(c => c.class == component).name;
        const components = [];
        for (const componentElement of Array.from(element.getElementsByTagName(name))) {
            if (componentElement.component) {
                components.push(componentElement.component);
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
        newElement.innerHTML = component.render();
        morphdom(component.element, newElement, this._morphdomOptions);
        component.onRender();
    }
    _initializeComponents() {
        for (const component of this._components) {
            this._initializeComponent(component);
        }
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
    _initializeComponent(component) {
        const app = this;
        class ComponentElement extends HTMLElement {
            connectedCallback() {
                this.component = new component.class(this);
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
        customElements.define(component.name, ComponentElement);
    }
}
Application._instance = null;
