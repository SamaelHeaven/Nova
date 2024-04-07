export class Component {
    constructor(element) {
        this.element = element;
    }
    input(key, defaultValue = null) {
        const attribute = this.element.attributes.getNamedItem(key);
        if (attribute) {
            return attribute.value;
        }
        return defaultValue;
    }
    update(value) {
        for (const key of this.getKeys()) {
            if (this[key] === value) {
                this[key] = value;
            }
        }
    }
    getKeys() {
        let keys = [];
        let prototype = this;
        while (prototype) {
            const parentPrototype = Object.getPrototypeOf(prototype);
            if (parentPrototype && Object.getPrototypeOf(parentPrototype)) {
                keys = keys.concat(Object.getOwnPropertyNames(prototype));
            }
            prototype = parentPrototype;
        }
        keys = [...new Set(keys)];
        return keys;
    }
    onStart() { }
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
