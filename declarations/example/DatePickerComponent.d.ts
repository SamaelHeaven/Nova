import { Component, ComponentDefinition } from "../nova/lib.js";
export declare class DatePickerComponent extends Component {
    static readonly definition: ComponentDefinition;
    private readonly _today;
    private _startDate;
    private _endDate;
    private _onStartDateInput;
    private _onEndDateInput;
    render(): string;
}
