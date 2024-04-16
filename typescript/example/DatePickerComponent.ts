import {Component, ComponentDefinition, Events, State} from "../nova/lib.js";

export class DatePickerComponent extends Component {
    public static readonly definition: ComponentDefinition = {tag: "date-picker-component", ctor: this}
    private readonly _today: string = new Date().format("yyyy-mm-dd");
    @State private _startDate: string = this._today;
    @State private _endDate: string | null = null;

    public override onInput(event: Events.Input): void {
        const startDateElement: HTMLInputElement = event.target.closest(`#start-date`);
        if (startDateElement) {
            this._startDate = new Date(startDateElement.value.replace(/-/g, "/")).format( "yyyy-mm-dd");
            return;
        }

        const endDateElement: HTMLInputElement = event.target.closest(`#end-date`);
        if (endDateElement) {
            this._endDate = new Date(endDateElement.value.replace(/-/g, "/")).format("yyyy-mm-dd");
        }
    }

    public override render(): string {
        return `
            <form>
                <label for="start-date">Start Date</label>
                <input id="start-date"
                       class="mt-2 form-control"
                       type="date"
                       value="${this._startDate.escape()}" 
                       min="${this._today.escape()}"
                       max="${(this._endDate || "").escape()}">

                <label class="mt-4" for="end-date">End Date</label>
                <input id="end-date" 
                       class="mt-2 form-control"
                       type="date" 
                       value="${(this._endDate || "").escape()}" 
                       min="${this._startDate.escape()}">
            </form>
        `;
    }
}