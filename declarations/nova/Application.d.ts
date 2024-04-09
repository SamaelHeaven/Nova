import { Component } from "./Component.js";
import { ComponentDefinition } from "./ComponentDefinition.js";
export declare class Application {
    private constructor();
    static launch(components: ComponentDefinition[]): void;
    static updateComponent(component: Component): void;
    static queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    static queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
}
