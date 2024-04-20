import { morphdom } from "./morphdom.js";
import { formatDate } from "./formatDate.js";
Date.prototype.format = formatDate;
export class Application {
    constructor() {
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
        this._morphdomOptions = {
            onBeforeElUpdated: (fromEl, toEl) => this._onBeforeElementUpdated(fromEl, toEl)
        };
    }
    static launch(componentDefinitions) {
        if (this._instance !== null) {
            throw new Error("Application has already been launched");
        }
        const app = this._getInstance();
        app._initializeComponents([...new Set(componentDefinitions)]);
        app._initializeEvents();
    }
    static updateComponent(component) {
        this._throwIfUninitialized();
        if (component.shouldUpdate) {
            this._getInstance()._updateComponent(component);
        }
    }
    static queryComponent(selector, element = document.documentElement) {
        var _a, _b;
        this._throwIfUninitialized();
        return ((_b = (_a = element.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.appComponent) === null || _b === void 0 ? void 0 : _b.instance) || null;
    }
    static queryComponents(selector, element = document.documentElement) {
        var _a;
        this._throwIfUninitialized();
        const components = [];
        for (const foundElement of Array.from(element.querySelectorAll(selector))) {
            const component = (_a = foundElement.appComponent) === null || _a === void 0 ? void 0 : _a.instance;
            if (component) {
                components.push(component);
            }
        }
        return components;
    }
    static closestComponent(selector, element) {
        var _a;
        this._throwIfUninitialized();
        const foundElement = element.closest(selector);
        if (!foundElement) {
            return null;
        }
        const component = (_a = foundElement.appComponent) === null || _a === void 0 ? void 0 : _a.instance;
        if (component) {
            return component;
        }
        return this.closestComponent(selector, foundElement.parentElement);
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
    registerComponentEvents(component) {
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
        for (const element of Array.from(component.element.parentElement.querySelectorAll("*"))) {
            const appComponent = element.appComponent;
            if (appComponent && appComponent.dirty) {
                appComponent.dirty = false;
                this._onElementUpdated(element);
            }
        }
    }
    _onBeforeElementUpdated(fromElement, toElement) {
        var _a;
        const component = (_a = fromElement.appComponent) === null || _a === void 0 ? void 0 : _a.instance;
        if (component && component.initialized && component.keys.includes("render")) {
            toElement.innerHTML = component.shouldUpdate ? component.render() : fromElement.innerHTML;
            toElement.style.display = "contents";
            toElement.setAttribute("data-uuid", component.uuid);
            if (component.shouldUpdate) {
                const morphResult = component.onMorph(toElement);
                fromElement.appComponent.dirty = true;
                if (morphResult === false) {
                    return false;
                }
            }
        }
        return !fromElement.isEqualNode(toElement);
    }
    _onElementUpdated(element) {
        var _a;
        const component = (_a = element.appComponent) === null || _a === void 0 ? void 0 : _a.instance;
        if (component && component.appeared) {
            component.onUpdate();
        }
    }
    _initializeComponents(componentDefinitions) {
        for (const component of componentDefinitions) {
            this._initializeComponent(component);
        }
    }
    _initializeComponent(componentDefinition) {
        const app = this;
        class ComponentElement extends HTMLElement {
            connectedCallback() {
                this.style.display = "contents";
                this.appComponent = { instance: new componentDefinition.ctor(this), dirty: false };
                this.setAttribute("data-uuid", this.appComponent.instance.uuid);
                const initResult = this.appComponent.instance.onInit();
                if (initResult instanceof Promise) {
                    initResult.then(() => app._initializeElement(this));
                    return;
                }
                app._initializeElement(this);
            }
            disconnectedCallback() {
                this.appComponent.instance.onDestroy();
            }
        }
        customElements.define(componentDefinition.tag, ComponentElement);
    }
    _initializeElement(element) {
        const component = element.appComponent.instance;
        component.initialized = true;
        this._observeAttributes(component);
        this.registerComponentEvents(component);
        this._updateComponent(component);
        component.onAppear();
        component.appeared = true;
    }
    _initializeEvents() {
        for (const eventName of this._eventNames) {
            document.documentElement.addEventListener(eventName, (event) => this._onEvent(event, event.target));
        }
    }
    _onEvent(event, element) {
        this._handleEvent(event, element);
        this._handleBind(event);
    }
    _handleEvent(event, element) {
        const eventElement = element.closest(`[data-on-${event.type}]`);
        if (!eventElement) {
            return;
        }
        const [uuid, call] = eventElement.getAttribute(`data-on-${event.type}`).split(";");
        const component = eventElement.closest(`[data-uuid="${uuid}"]`).appComponent.instance;
        if (component[call](event) !== false) {
            this._handleEvent(event, eventElement.parentElement);
        }
    }
    _handleBind(event) {
        if (event.type !== "input") {
            return;
        }
        const bindElement = event.target;
        const binding = bindElement.getAttribute("data-bind");
        if (!binding) {
            return;
        }
        const [uuid, key] = binding.split(";");
        let value = bindElement.value;
        if (value === undefined || value === null) {
            value = bindElement.getAttribute("value");
        }
        if (value !== undefined && value !== null) {
            const component = bindElement.closest(`[data-uuid="${uuid}"]`).appComponent.instance;
            component[key] = value;
        }
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
