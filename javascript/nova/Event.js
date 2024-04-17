export function Event(type) {
    return function (target, key) {
        const field = Symbol(key);
        Object.defineProperty(target, field, {
            writable: true,
            enumerable: false,
            configurable: true,
        });
        const getter = function () {
            const result = this[field];
            result.toString = () => this.on(type, key);
            return result;
        };
        const setter = function (newValue) {
            this[field] = newValue;
        };
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}
