import { Component } from "./Component.js";
export function State(target, key) {
    const field = Symbol(key);
    Object.defineProperty(target, field, {
        writable: true,
        enumerable: false,
        configurable: true,
    });
    const getter = function () {
        return this[field];
    };
    const setter = function (newValue) {
        if (this[field] === newValue) {
            return;
        }
        this[field] = newValue;
        this.update();
        for (const [subscriber, state] of this.subscribers) {
            if (subscriber === this) {
                continue;
            }
            if (state === key) {
                if (subscriber instanceof Component) {
                    subscriber.update();
                    continue;
                }
                subscriber();
            }
        }
    };
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}
