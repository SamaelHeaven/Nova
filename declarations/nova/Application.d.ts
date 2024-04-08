import { Component } from "./Component.js";
export declare class Application {
    private constructor();
    static launch(components: {
        name: string;
        class: (new (element: HTMLElement) => Component);
    }[]): void;
    static updateComponent(component: Component): void;
    static getComponent<T extends Component>(component: (new (element: HTMLElement) => T), element?: HTMLElement): T | null;
    static getComponents<T extends Component>(component: (new (element: HTMLElement) => T), element?: HTMLElement): T[];
}
