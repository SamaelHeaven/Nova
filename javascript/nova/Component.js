import { Application } from "./Application.js";
export class Component {
    constructor(element) {
        this.element = element;
    }
    render() {
        return undefined;
    }
    onInit() { }
    onAppear() { }
    onUpdate() { }
    onDestroy() { }
    onMorph(toElement) { }
    onAttributeChanged(attribute, oldValue, newValue) { }
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
}
