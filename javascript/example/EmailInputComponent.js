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
import { Component, escape, State } from "../nova/lib.js";
export class EmailInputComponent extends Component {
    constructor() {
        super(...arguments);
        this.email = "";
    }
    onSubmit(event) {
        event.preventDefault();
    }
    render() {
        const valid = this._valid;
        return `
            <form>
                <label for="email-input-${this.uuid}">Email</label>
                <input ${this.bind("email")} type="text" id="email-input-${this.uuid}" class="form-control mt-2" placeholder="Email">
                ${this.email.trim().length > 0 ? `
                    <div style="word-break: break-all" class="alert alert-${valid ? "success" : "danger"} mt-4" role="alert">
                        ${escape(this.email)} is an ${valid ? "valid" : "invalid"} email
                    </div>
                ` : ""}
            </form>
        `;
    }
    get _valid() {
        return !!this.email.trim().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
}
_a = EmailInputComponent;
EmailInputComponent.definition = _a.define("email-input-component");
__decorate([
    State,
    __metadata("design:type", String)
], EmailInputComponent.prototype, "email", void 0);
