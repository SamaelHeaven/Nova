import { Component } from "./Component.js";
import { Application } from "./Application.js";
export function State(target, key) {
    const field = `@State_${key}`;
    Object.defineProperty(target, field, {
        writable: true,
        enumerable: false,
        configurable: true,
    });
    const getter = function () {
        return this[field];
    };
    const setter = function (newValue) {
        this[field] = newValue;
        if (this instanceof Component) {
            Application.updateComponent(this);
        }
    };
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}
