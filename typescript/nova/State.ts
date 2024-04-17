import {Component} from "./Component.js";

export function State<T extends Component>(target: T, key: string): void {
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
        this.update();

        for (const [component, state] of this.subscribers) {
            if (component === this) {
                continue;
            }

            if (state === key) {
                component.update();
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