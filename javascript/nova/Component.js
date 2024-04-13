import { Application } from "./Application.js";
export class Component {
    constructor(element) {
        this.element = element;
    }
    render() {
        return undefined;
    }
    update(state) {
        for (const key of this.getKeys()) {
            if (this[key] === state) {
                this[key] = state;
            }
        }
    }
    queryComponent(selector, element) {
        return Application.queryComponent(selector, element);
    }
    queryComponents(selector, element) {
        return Application.queryComponents(selector, element);
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
    onInit() { }
    onAppear() { }
    onUpdate() { }
    onDestroy() { }
    onMorph(toElement) { }
    onAttributeChanged(attribute, oldValue, newValue) { }
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
