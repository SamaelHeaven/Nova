import { Component } from "./Component.js";
export declare function Event(type: keyof GlobalEventHandlersEventMap): <T extends Component>(target: T, key: string) => void;
