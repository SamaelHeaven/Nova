import { Component } from "./Component.js";
import { Application } from "./Application.js";
export function State(target, key) {
    let value = target[key];
    const getter = function () {
        return value;
    };
    const setter = function (newVal) {
        value = newVal;
        if (this instanceof Component) {
            Application.update(this);
        }
    };
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}
