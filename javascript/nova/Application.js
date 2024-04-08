import { morphdom } from "./morphdom.js";
import { Validation } from "./Validation.js";
export class Application {
    constructor() {
        this._componentDefinitions = [];
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromElement, toElement) {
                return !fromElement.isEqualNode(toElement);
            }
        };
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
    }
    static launch(componentClasses) {
        if (Application._instance !== null) {
            throw new Error("Application has already been launched");
        }
        const app = Application._getInstance();
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
    static updateComponent(component) {
        Application._throwIfUninitialized();
        if (component.element.component !== component) {
            return;
        }
        const app = Application._getInstance();
        while (app._updating) { }
        app._updating = true;
        app._updateComponent(component);
        app._updating = false;
    }
    static updateElement(element) {
        Application._throwIfUninitialized();
        const app = Application._getInstance();
        while (app._updating) { }
        app._updating = true;
        const newElement = element.cloneNode(true);
        app._updateElement(newElement);
        morphdom(element, newElement, app._morphdomOptions);
        app._updating = false;
    }
    static getComponentById(id) {
        var _a;
        Application._throwIfUninitialized();
        return (_a = document.getElementById(id).component) !== null && _a !== void 0 ? _a : null;
    }
    static getComponentByClass(clazz) {
        var _a;
        Application._throwIfUninitialized();
        const name = Application._getComponentName(clazz);
        const element = document.querySelector(name);
        if (!element) {
            return null;
        }
        return (_a = element.component) !== null && _a !== void 0 ? _a : null;
    }
    static getComponentsByClass(clazz) {
        Application._throwIfUninitialized();
        const name = Application._getComponentName(clazz);
        const elements = Array.from(document.querySelectorAll(name));
        const result = [];
        for (const element of elements) {
            if (element.component) {
                result.push(element.component);
            }
        }
        return result;
    }
    static _getInstance() {
        var _a;
        return (_a = Application._instance) !== null && _a !== void 0 ? _a : (Application._instance = new Application());
    }
    static _getComponentName(clazz) {
        const className = clazz.name;
        let result = '';
        for (let i = 0; i < className.length; i++) {
            if (i > 0 && className[i] === className[i].toUpperCase()) {
                result += '-';
            }
            result += className[i].toLowerCase();
        }
        return result;
    }
    static _throwIfUninitialized() {
        if (Application._instance === null) {
            throw new Error("Application has not been launched");
        }
    }
    _updateElement(root) {
        for (const componentDefinition of this._componentDefinitions) {
            for (const element of Array.from(root.getElementsByTagName(componentDefinition.name))) {
                if (!element.id || document.querySelectorAll(`#${element.id}`).length > 1) {
                    throw new Error("Components must have an unique id");
                }
                const existingElement = document.getElementById(element.id);
                let component;
                if (!existingElement || !existingElement.component) {
                    component = new componentDefinition.class(element);
                    this._registerEventListeners(component);
                    element.component = component;
                    component.onInit();
                }
                else {
                    component = existingElement.component;
                }
                const renderedContent = component.render();
                if (!Validation.isNullOrUndefined(renderedContent)) {
                    element.innerHTML = renderedContent;
                }
                this._updateElement(element);
            }
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
        this._updateElement(newElement);
        morphdom(component.element, newElement, this._morphdomOptions);
    }
}
Application._instance = null;
