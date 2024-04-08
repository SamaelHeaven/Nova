import {Component} from "./Component.js";
import {Application} from "./Application.js";

export function State(target: any, key: string): void {
    let value = target[key];

    const getter = function () {
        return value;
    };

    const setter = function (newValue: any): void {
        value = newValue;
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