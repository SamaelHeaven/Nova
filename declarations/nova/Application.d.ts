import { Component } from "./Component.js";
export declare class Application {
    private constructor();
    static launch(componentClasses: (new (...args: any[]) => Component)[]): void;
    static updateComponent(component: Component): void;
    static updateElement(element: HTMLElement): void;
    static getComponentById<T extends Component>(id: string): T | null;
    static getComponentByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T | null;
    static getComponentsByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T[];
}
