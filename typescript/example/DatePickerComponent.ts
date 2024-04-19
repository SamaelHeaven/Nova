import {Component, ComponentDefinition, escapeHTML, Events, Event, State} from "../nova/lib.js";

export class DatePickerComponent extends Component {
    public static definition: ComponentDefinition = this.define("date-picker-component");
    private _today: string = new Date().format("yyyy-mm-dd");
    @State private _startDate: string = this._today;
    @State private _endDate: string | null = null;

    @Event("input")
    public onStartDateInput(event: Events.Input<HTMLInputElement>): void {
        this._startDate = new Date(event.target.value.replace(/-/g, "/")).format("yyyy-mm-dd");
    }

    @Event("input")
    public onEndDateInput(event: Events.Input<HTMLInputElement>): void {
        this._endDate = new Date(event.target.value.replace(/-/g, "/")).format("yyyy-mm-dd");
    }

    public override render(): string {
        return `
            <form>
                <label for="start-date-${this.uuid}">Start Date</label>
                <input id="start-date-${this.uuid}"
                       ${this.onStartDateInput}
                       class="mt-2 form-control"
                       type="date"
                       value="${escapeHTML(this._startDate)}" 
                       min="${escapeHTML(this._today)}"
                       max="${escapeHTML(this._endDate || "")}">

                <label class="mt-4" for="end-date-${this.uuid}">End Date</label>
                <input id="end-date-${this.uuid}" 
                       ${this.onEndDateInput}
                       class="mt-2 form-control"
                       type="date" 
                       value="${escapeHTML(this._endDate || "")}" 
                       min="${escapeHTML(this._startDate)}">
            </form>
        `;
    }
}