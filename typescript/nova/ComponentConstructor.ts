import {Component} from "./Component.js";

export type ComponentConstructor<T extends Component> = (new (element: HTMLElement) => T);