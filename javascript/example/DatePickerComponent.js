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
import { Component, escapeHTML, Event, State } from "../nova/lib.js";
export class DatePickerComponent extends Component {
    constructor() {
        super(...arguments);
        this._today = new Date().format("yyyy-mm-dd");
        this._startDate = this._today;
        this._endDate = null;
    }
    onStartDateInput(event) {
        this._startDate = new Date(event.target.value.replace(/-/g, "/")).format("yyyy-mm-dd");
    }
    onEndDateInput(event) {
        this._endDate = new Date(event.target.value.replace(/-/g, "/")).format("yyyy-mm-dd");
    }
    render() {
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
_a = DatePickerComponent;
DatePickerComponent.definition = _a.define("date-picker-component");
__decorate([
    State,
    __metadata("design:type", String)
], DatePickerComponent.prototype, "_startDate", void 0);
__decorate([
    State,
    __metadata("design:type", String)
], DatePickerComponent.prototype, "_endDate", void 0);
__decorate([
    Event("input"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DatePickerComponent.prototype, "onStartDateInput", null);
__decorate([
    Event("input"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DatePickerComponent.prototype, "onEndDateInput", null);
