import {Component, Events, Format, State} from "../nova/lib.js";

export class DatePickerComponent extends Component {
    private readonly _today: string = Format.date("today", "yyyy-mm-dd");
    @State private _startDate: string = this._today;
    @State private _endDate: string | null = null;

    public override onInput(event: Events.Input): void {
        const startDateElement: HTMLInputElement = event.target.closest(`#start-date-${this.id}`);
        if (startDateElement) {
            this._startDate = Format.date(startDateElement.value.replace(/-/g, "/"), "yyyy-mm-dd");
            return;
        }

        const endDateElement: HTMLInputElement = event.target.closest(`#end-date-${this.id}`);
        if (endDateElement) {
            this._endDate = Format.date(endDateElement.value.replace(/-/g, "/"), "yyyy-mm-dd");
        }
    }

    public override render(): string {
        return `
            <form>
                <label for="start-date-${this.id}">Start Date</label>
                <input id="start-date-${this.id}"
                       class="mt-2 form-control"
                       type="date"
                       value="${this._startDate}" 
                       min="${this._today}"
                       max="${this._endDate || ""}">

                <label class="mt-4" for="end-date-${this.id}">End Date</label>
                <input id="end-date-${this.id}" 
                       class="mt-2 form-control"
                       type="date" 
                       value="${this._endDate || ""}" 
                       min="${this._startDate}">
            </form>
        `;
    }
}