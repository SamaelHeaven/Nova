import {Component, ComponentDefinition, escape, Events, Event, State} from "../nova/lib.js";

export class DatePickerComponent extends Component {
    public static readonly definition: ComponentDefinition = this.define("date-picker-component");
    private readonly _today: string = new Date().format("yyyy-mm-dd");
    @State private _startDate: string = this._today;
    @State private _endDate: string | null = null;

    @Event("input")
    private _onStartDateInput = function (event: Events.Input<HTMLInputElement>): void {
        this._startDate = new Date(event.target.value.replace(/-/g, "/")).format("yyyy-mm-dd");
    }.bind(this);

    @Event("input")
    private _onEndDateInput = function (event: Events.Input<HTMLInputElement>): void {
        this._endDate = new Date(event.target.value.replace(/-/g, "/")).format("yyyy-mm-dd");
    }.bind(this);

    public override render(): string {
        return `
            <form>
                <label for="start-date">Start Date</label>
                <input id="start-date"
                       ${this._onStartDateInput.toString()}
                       class="mt-2 form-control"
                       type="date"
                       value="${escape(this._startDate)}" 
                       min="${escape(this._today)}"
                       max="${escape(this._endDate || "")}">

                <label class="mt-4" for="end-date">End Date</label>
                <input id="end-date" 
                       ${this._onEndDateInput.toString()}
                       class="mt-2 form-control"
                       type="date" 
                       value="${escape(this._endDate || "")}" 
                       min="${escape(this._startDate)}">
            </form>
        `;
    }
}