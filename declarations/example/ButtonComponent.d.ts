import { Component, ComponentDefinition, Events } from "../nova/lib.js";
export declare class ButtonComponent extends Component {
    static readonly definition: ComponentDefinition;
    private _content;
    private _count;
    onInit(): void;
    onAppear(): void;
    onUpdate(): void;
    onClick(_: Events.Mouse): void;
    onDestroy(): void;
    onAttributeChanged(attribute: string, oldValue: string, newValue: string): void;
    render(): string;
}
