import { Component, Events } from "../nova/lib.js";
export declare class NumberInputComponent extends Component {
    private _min;
    private _max;
    onInput(event: Events.Input): void;
    render(): string;
}
