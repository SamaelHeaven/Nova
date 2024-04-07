import { morphdom } from "./morphdom.js";
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
        const app = this._getInstance();
        for (const componentClass of componentClasses) {
            app._componentDefinitions.push({
                name: Application._getComponentName(componentClass),
                ctor: componentClass
            });
        }
        app._updateElement(document.documentElement);
    }
    static update(component) {
        Application._throwIfUninitialized();
        if (component.element.component !== component) {
            return;
        }
        Application._getInstance()._updateComponent(component);
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
            for (const element of Array.from(root.querySelectorAll(componentDefinition.name))) {
                if (element.component) {
                    continue;
                }
                if (!element.id || document.querySelectorAll(`#${element.id}`).length > 1) {
                    throw new Error("Components must have an unique id");
                }
                element.style.display = "contents";
                const existingElement = document.getElementById(element.id);
                let component;
                if (!existingElement || !existingElement.component) {
                    component = new componentDefinition.ctor(element);
                    this._registerEventListeners(component);
                    element.component = component;
                    component.onInit();
                }
                else {
                    component = existingElement.component;
                }
                element.innerHTML = component.render();
                this._updateElement(element);
            }
        }
    }
    _registerEventListeners(component) {
        for (const key of component.getKeys()) {
            const eventType = key.substring(2).toLowerCase();
            if (this._eventNames.indexOf(eventType) !== -1) {
                component.element.addEventListener(eventType, (event) => {
                    component[key](event);
                });
            }
        }
    }
    _updateComponent(component) {
        const newElement = component.element.cloneNode(false);
        newElement.innerHTML = component.render();
        this._updateElement(newElement);
        morphdom(component.element, newElement, this._morphdomOptions);
    }
}
Application._instance = null;
