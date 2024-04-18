import { Component } from "./Component.js";
import { Events } from "./Events.js";
export declare function Event(type: keyof GlobalEventHandlersEventMap): <T extends Component>(_: T, key: string, propertyDescriptor: TypedPropertyDescriptor<(event?: Events.Base) => void>) => {
    get: () => (event?: Events.Base) => void;
    set: (value: any) => void;
    enumerable: boolean;
    configurable: boolean;
};
