import {Component} from "./Component.js";
import {Events} from "./Events.js";

export function Event(type: keyof GlobalEventHandlersEventMap) {
    return function <T extends Component>(_: T, key: keyof T & string, propertyDescriptor: TypedPropertyDescriptor<(event?: Events.Base) => void>) {
        return {
            get: function (): (event?: Events.Base) => void {
                const method = propertyDescriptor.value.bind(this);
                method.toString = (): string => this.on(type, key);
                return method;
            },
            enumerable: true,
            configurable: true
        };
    }
}