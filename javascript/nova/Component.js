import { Application } from "./Application.js";
export class Component {
    constructor(element) {
        this._element = element;
    }
    render() {
        return undefined;
    }
    get id() {
        return this._element.id;
    }
    get element() {
        return this._element;
    }
    getAttribute(name, defaultValue = null) {
        const attribute = this._element.attributes.getNamedItem(name);
        if (attribute) {
            return attribute.value;
        }
        return defaultValue;
    }
    update(state) {
        for (const key of this.getKeys()) {
            if (this[key] === state) {
                this[key] = state;
            }
        }
    }
    getKeys() {
        let keys = [];
        let currentPrototype = this;
        while (currentPrototype) {
            const parentPrototype = Object.getPrototypeOf(currentPrototype);
            if (parentPrototype && Object.getPrototypeOf(parentPrototype)) {
                keys = keys.concat(Object.getOwnPropertyNames(currentPrototype));
            }
            currentPrototype = parentPrototype;
        }
        return [...new Set(keys)];
    }
    getComponentById(id) {
        return Application.getComponentById(id);
    }
    getComponentByClass(clazz) {
        return Application.getComponentByClass(clazz);
    }
    getComponentsByClass(clazz) {
        return Application.getComponentsByClass(clazz);
    }
    onInit() { }
    onClick(event) { }
    onDblClick(event) { }
    onMouseDown(event) { }
    onMouseUp(event) { }
    onMouseMove(event) { }
    onMouseEnter(event) { }
    onMouseLeave(event) { }
    onMouseOver(event) { }
    onMouseOut(event) { }
    onKeyDown(event) { }
    onKeyPress(event) { }
    onKeyUp(event) { }
    onFocus(event) { }
    onBlur(event) { }
    onInput(event) { }
    onChange(event) { }
    onSubmit(event) { }
    onScroll(event) { }
    onError(event) { }
    onResize(event) { }
    onSelect(event) { }
    onTouchStart(event) { }
    onTouchMove(event) { }
    onTouchEnd(event) { }
    onTouchCancel(event) { }
    onAnimationStart(event) { }
    onAnimationEnd(event) { }
    onAnimationIteration(event) { }
    onTransitionStart(event) { }
    onTransitionEnd(event) { }
    onTransitionCancel(event) { }
}
