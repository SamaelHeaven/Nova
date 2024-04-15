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
import { Component, State } from "../nova/lib.js";
export class ButtonComponent extends Component {
    constructor() {
        super(...arguments);
        this._count = 0;
    }
    render() {
        return "button".html()
            .class("btn btn-primary")
            .append(this._count > 0 ? `Count: ${this._count}!` : "Click Me!")
            .on("click", () => this._count++);
    }
}
_a = ButtonComponent;
ButtonComponent.definition = { tag: "button-component", ctor: _a };
__decorate([
    State,
    __metadata("design:type", Number)
], ButtonComponent.prototype, "_count", void 0);
