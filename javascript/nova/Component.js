import { Application } from "./Application.js";
export class Component {
    constructor(element) {
        this.uuid = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (value) => (+value ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +value / 4).toString(16));
        this.element = element;
        this.initialized = false;
        this.appeared = false;
        this.shouldUpdate = true;
        let keys = [];
        let currentPrototype = this;
        while (currentPrototype) {
            const parentPrototype = Object.getPrototypeOf(currentPrototype);
            if (parentPrototype && Object.getPrototypeOf(parentPrototype)) {
                keys = keys.concat(Object.getOwnPropertyNames(currentPrototype));
            }
            currentPrototype = parentPrototype;
        }
        this.keys = [...new Set(keys)];
    }
    static define(tag) {
        return { tag, ctor: this };
    }
    subscribe(component, state) {
        for (const key of component.keys) {
            if (key !== state) {
                continue;
            }
            const prototype = Object.getPrototypeOf(component);
            const descriptor = Object.getOwnPropertyDescriptor(prototype, state);
            const scope = this;
            const setter = function (newValue) {
                descriptor.set.call(this, newValue);
                if (this === component) {
                    scope.update();
                }
            };
            Object.defineProperty(prototype, key, {
                get: descriptor.get,
                set: setter,
                enumerable: true,
                configurable: true,
            });
            return;
        }
    }
    render() {
        return "";
    }
    update(before) {
        if (before) {
            const shouldUpdate = this.shouldUpdate;
            this.shouldUpdate = false;
            const beforeResult = before();
            if (beforeResult instanceof Promise) {
                beforeResult.then(() => {
                    this.shouldUpdate = shouldUpdate;
                    Application.updateComponent(this);
                });
                return;
            }
            else {
                this.shouldUpdate = shouldUpdate;
            }
        }
        Application.updateComponent(this);
    }
    on(event, key) {
        return `data-event="${this.uuid},${event},${key}"`;
    }
    queryComponent(selector, element) {
        return Application.queryComponent(selector, element);
    }
    queryComponents(selector, element) {
        return Application.queryComponents(selector, element);
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
