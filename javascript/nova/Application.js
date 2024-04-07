import { morphdom } from "./morphdom.js";
export class Application {
    constructor() {
        /** @internal */
        this._eventNames = [
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
            "load",
            "unload",
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
        this._components = [];
        this._morphdomOption = {
            onBeforeElUpdated: function (fromElement, toElement) {
                return !fromElement.isEqualNode(toElement);
            }
        };
    }
    static launch(components) {
        const app = this._getInstance();
        for (const component of components) {
            app._components.push({
                name: Application._getComponentName(component.name),
                ctor: component
            });
        }
        app._updateElement(document.documentElement);
    }
    static update(component) {
        if (Application._instance === null) {
            return;
        }
        Application._getInstance()._updateComponent(component);
    }
    static getComponent(clazz) {
        var _a;
        if (Application._instance === null) {
            return null;
        }
        const name = Application._getComponentName(clazz.name);
        const element = document.querySelector(name);
        if (!element) {
            return null;
        }
        return (_a = element.component) !== null && _a !== void 0 ? _a : null;
    }
    static getComponents(clazz) {
        if (Application._instance === null) {
            return [];
        }
        const name = Application._getComponentName(clazz.name);
        const elements = Array.from(document.querySelectorAll(name));
        const result = [];
        for (const element of elements) {
            if (element.component) {
                result.push(element.component);
            }
        }
        return result;
    }
    /** @internal */
    static _getInstance() {
        var _a;
        return (_a = Application._instance) !== null && _a !== void 0 ? _a : (Application._instance = new Application());
    }
    /** @internal */
    static _getComponentName(input) {
        let result = '';
        for (let i = 0; i < input.length; i++) {
            if (i > 0 && input[i] === input[i].toUpperCase()) {
                result += '-';
            }
            result += input[i].toLowerCase();
        }
        return result;
    }
    /** @internal */
    _updateElement(root) {
        for (const component of this._components) {
            for (const element of Array.from(root.querySelectorAll(component.name))) {
                const loaded = element.attributes.getNamedItem("nova-loaded");
                if (loaded && loaded.value === "true") {
                    continue;
                }
                element.setAttribute("nova-loaded", "true");
                element.style.display = "inline-block";
                element.style.width = "fit-content";
                element.style.height = "fit-content";
                const componentInstance = new component.ctor(element);
                this._registerEventListeners(componentInstance);
                element.component = componentInstance;
                element.innerHTML = componentInstance.render();
            }
        }
    }
    /** @internal */
    _registerEventListeners(componentInstance) {
        for (const key of componentInstance.getKeys()) {
            if (typeof componentInstance[key] === "function" && key.startsWith('on')) {
                const eventType = key.substring(2).toLowerCase();
                if (this._eventNames.indexOf(eventType) !== -1) {
                    componentInstance.element.addEventListener(eventType, (event) => {
                        componentInstance[key](event);
                    });
                }
            }
        }
    }
    /** @internal */
    _updateComponent(component) {
        const newElement = component.element.cloneNode(false);
        newElement.innerHTML = component.render();
        morphdom(component.element, newElement, this._morphdomOption);
        this._updateElement(component.element);
    }
}
/** @internal */
Application._instance = null;
