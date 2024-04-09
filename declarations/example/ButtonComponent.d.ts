import { Component, ComponentDefinition, Events } from "../nova/lib.js";
export declare class ButtonComponent extends Component {
    static readonly definition: ComponentDefinition;
    private _content;
    private _count;
    onInit(): void;
    onAppear(): void;
    onAttributeChanged(attribute: string, _: string, newValue: string): void;
    onClick(_: Events.Mouse): void;
    onDestroy(): void;
    render(): string;
}
