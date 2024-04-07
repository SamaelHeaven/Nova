import { Component } from "./Component.js";
export declare class Application {
    private constructor();
    static launch(components: (new (...args: any[]) => Component)[]): void;
    static update(component: Component): void;
    static getComponent<T extends Component>(clazz: (new (...args: any[]) => T)): T | null;
    static getComponents<T extends Component>(clazz: (new (...args: any[]) => T)): T[];
}
