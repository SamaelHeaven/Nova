import { Component } from "./Component.js";
import { Events } from "./Events.js";
export declare function Event(type: keyof GlobalEventHandlersEventMap): <T extends Component>(_: T, key: keyof T & string, propertyDescriptor: TypedPropertyDescriptor<(event?: Events.Base) => void>) => {
    get: () => (event?: Events.Base) => void;
    enumerable: boolean;
    configurable: boolean;
};
