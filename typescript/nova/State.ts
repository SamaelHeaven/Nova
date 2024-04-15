import {Component} from "./Component.js";
import {Application} from "./Application.js";

export function State(target: Component, key: string): void {
    const field: symbol = Symbol(key);
    Object.defineProperty(target, field, {
        writable: true,
        enumerable: false,
        configurable: true,
    });

    const getter = function () {
        return this[field];
    };

    const setter = function (newValue: any): void {
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