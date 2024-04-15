import { Component } from "./Component.js";
import { ComponentDefinition } from "./ComponentDefinition.js";
import { Html } from "./Html.js";
declare global {
    interface String {
        html(): Html;
    }
    interface Date {
        format(format: string): string;
    }
}
export declare class Application {
    private constructor();
    static launch(components: ComponentDefinition[]): void;
    static updateComponent(component: Component): void;
    static queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    static queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
}
