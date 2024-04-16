import { Component, ComponentDefinition, Events } from "../nova/lib.js";
export declare class DatePickerComponent extends Component {
    static readonly definition: ComponentDefinition;
    private readonly _today;
    private _startDate;
    private _endDate;
    onInput(event: Events.Input): void;
    render(): string;
}
