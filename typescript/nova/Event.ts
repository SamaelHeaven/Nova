import {Component} from "./Component.js";

export function Event(type: keyof GlobalEventHandlersEventMap) {
    function event<T extends Component>(target: T, key: string): void {
        const field: symbol = Symbol(key);
        Object.defineProperty(target, field, {
            writable: true,
            enumerable: false,
            configurable: true,
        });

        const getter = function () {
            const result = this[field];
            result.toString = (): string => this.on(type, key);
            return result;
        };

        const setter = function (newValue: any): void {
            this[field] = newValue;
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    }

    return event;
}