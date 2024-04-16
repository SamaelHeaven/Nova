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
import { Component, Debounce, State } from "../nova/lib.js";
export class EmailInputComponent extends Component {
    constructor() {
        super(...arguments);
        this._valid = false;
        this._inputDebounce = new Debounce(this._onDebounceInput.bind(this), 300);
    }
    onInput(event) {
        this._inputDebounce.call(event);
    }
    render() {
        return `
            <form>
                <label for="email-input">Email</label>
                <input type="email" id="email-input" class="form-control mt-2" placeholder="Email">
                ${this._valid ? `
                    <div class="alert alert-success mt-4" role="alert">
                        Email is valid
                    </div>
                ` : `
                    <div class="alert alert-danger mt-4" role="alert">
                        Email is invalid
                    </div>
                `}
            </form>
        `;
    }
    _onDebounceInput(event) {
        this._valid = !!event.target.value.trim().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
}
_a = EmailInputComponent;
EmailInputComponent.definition = _a.define("email-input-component");
__decorate([
    State,
    __metadata("design:type", Boolean)
], EmailInputComponent.prototype, "_valid", void 0);
