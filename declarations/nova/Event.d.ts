import { Component } from "./Component.js";
export declare function Event(type: keyof GlobalEventHandlersEventMap): (target: Component, key: string) => void;
