import { Component } from "./Component";
export type ComponentDefinition = {
    tag: string;
    ctor: (new (element: HTMLElement) => Component);
};
