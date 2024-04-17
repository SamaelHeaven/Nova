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
import { Component, escape, Event, State } from "../nova/lib.js";
export class DatePickerComponent extends Component {
    constructor() {
        super(...arguments);
        this._today = new Date().format("yyyy-mm-dd");
        this._startDate = this._today;
        this._endDate = null;
        this._onStartDateInput = function (event) {
            this._startDate = new Date(event.target.value.replace(/-/g, "/")).format("yyyy-mm-dd");
        }.bind(this);
        this._onEndDateInput = function (event) {
            this._endDate = new Date(event.target.value.replace(/-/g, "/")).format("yyyy-mm-dd");
        }.bind(this);
    }
    render() {
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
    __metadata("design:type", Object)
], DatePickerComponent.prototype, "_onStartDateInput", void 0);
__decorate([
    Event("input"),
    __metadata("design:type", Object)
], DatePickerComponent.prototype, "_onEndDateInput", void 0);
