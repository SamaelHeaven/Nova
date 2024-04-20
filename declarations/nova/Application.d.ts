import { Component } from "./Component.js";
import { ComponentDefinition } from "./ComponentDefinition.js";
declare global {
    interface Date {
        format(format: string): string;
    }
    interface HTMLElement {
        appComponent?: {
            instance: Component;
            dirty: boolean;
        };
    }
}
export declare class Application {
    private constructor();
    static launch(componentDefinitions: ComponentDefinition[]): void;
    static updateComponent(component: Component): void;
    static queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    static queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
    static closestComponent<T extends Component>(selector: string, element: HTMLElement): T | null;
}
