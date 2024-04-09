var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { Component, Format, State } from "../nova/lib.js";
export class DatePickerComponent extends Component {
    constructor() {
        super(...arguments);
        this._today = Format.date(undefined, "yyyy-mm-dd");
        this._startDate = this._today;
        this._endDate = null;
    }
    onInput(event) {
        const startDateElement = event.target.closest(`#start-date`);
        if (startDateElement) {
            this._startDate = Format.date(startDateElement.value.replace(/-/g, "/"), "yyyy-mm-dd");
            return;
        }
        const endDateElement = event.target.closest(`#end-date`);
        if (endDateElement) {
            this._endDate = Format.date(endDateElement.value.replace(/-/g, "/"), "yyyy-mm-dd");
        }
    }
    render() {
        return `
            <form>
                <label for="start-date">Start Date</label>
                <input id="start-date"
                       class="mt-2 form-control"
                       type="date"
                       value="${this._startDate}" 
                       min="${this._today}"
                       max="${this._endDate || ""}">

                <label class="mt-4" for="end-date">End Date</label>
                <input id="end-date" 
                       class="mt-2 form-control"
                       type="date" 
                       value="${this._endDate || ""}" 
                       min="${this._startDate}">
            </form>
        `;
    }
}
_a = DatePickerComponent;
DatePickerComponent.definition = { tagName: "date-picker-component", constructor: _a };
__decorate([
    State,
    __metadata("design:type", String)
], DatePickerComponent.prototype, "_startDate", void 0);
__decorate([
    State,
    __metadata("design:type", String)
], DatePickerComponent.prototype, "_endDate", void 0);
