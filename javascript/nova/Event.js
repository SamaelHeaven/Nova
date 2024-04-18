export function Event(type) {
    return function (_, key, propertyDescriptor) {
        return {
            get: function () {
                const method = propertyDescriptor.value.bind(this);
                method.toString = () => this.on(type, key);
                return method;
            },
            set: function (value) {
                propertyDescriptor.value = value;
            },
            enumerable: true,
            configurable: true
        };
    };
}
