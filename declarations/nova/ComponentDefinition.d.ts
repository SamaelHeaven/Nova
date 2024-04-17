import { ComponentConstructor } from "./ComponentConstructor.js";
export type ComponentDefinition = {
    tag: string;
    ctor: ComponentConstructor;
};
