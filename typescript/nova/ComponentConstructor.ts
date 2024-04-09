import {Component} from "./Component.js";

export type ComponentConstructor = (new (element: HTMLElement) => Component);