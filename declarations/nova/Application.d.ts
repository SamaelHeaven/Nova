import { Component } from "./Component.js";
export declare class Application {
    private static _instance;
    private readonly _components;
    private readonly _morphdomOption;
    private constructor();
    static launch(components: (new (...args: any[]) => Component)[]): void;
    static update(component: Component): void;
    static getComponent<T extends Component>(clazz: (new (...args: any[]) => T)): T | null;
    static getComponents<T extends Component>(clazz: (new (...args: any[]) => T)): T[];
    private static _getInstance;
    private static _getComponentName;
    private _updateElement;
    private _registerEventListeners;
    private _updateComponent;
}
