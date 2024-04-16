import { Component, ComponentDefinition, Events } from "../nova/lib.js";
export declare class EmailInputComponent extends Component {
    static readonly definition: ComponentDefinition;
    private _valid;
    private readonly _inputDebounce;
    onInput(event: Events.Input): void;
    render(): string;
    private _onDebounceInput;
}
