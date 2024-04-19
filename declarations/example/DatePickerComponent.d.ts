import { Component, ComponentDefinition, Events } from "../nova/lib.js";
export declare class DatePickerComponent extends Component {
    static definition: ComponentDefinition;
    private _today;
    private _startDate;
    private _endDate;
    onStartDateInput(event: Events.Input<HTMLInputElement>): void;
    onEndDateInput(event: Events.Input<HTMLInputElement>): void;
    render(): string;
}
