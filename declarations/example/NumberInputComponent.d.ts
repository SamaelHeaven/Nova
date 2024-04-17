import { Component, ComponentDefinition, Events } from "../nova/lib.js";
export declare class NumberInputComponent extends Component {
    static readonly definition: ComponentDefinition;
    private _min;
    private _max;
    onInput(event: Events.Input<HTMLInputElement>): void;
    render(): string;
}
