import {Component} from "./Component.js";
import {Application} from "./Application.js";

export function State(target: any, key: string): void {
    let value = target[key];

    const getter = function () {
        return value;
    };

    const setter = function (newVal: any): void {
        value = newVal;
        if (this instanceof Component) {
            Application.update(this as Component);
        }
    };

    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}