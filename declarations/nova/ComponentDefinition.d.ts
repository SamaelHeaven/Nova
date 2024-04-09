import { Component } from "./Component.js";
import { ComponentConstructor } from "./ComponentConstructor.js";
export type ComponentDefinition = {
    tagName: string;
    constructor: ComponentConstructor<Component>;
};
