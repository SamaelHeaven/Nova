import { Component, Events } from "../nova/lib.js";
export declare class EmailInputComponent extends Component {
    private _valid;
    private readonly _inputDebounce;
    onInput(event: Events.Input): void;
    render(): string;
    private _onDebounceInput;
}
