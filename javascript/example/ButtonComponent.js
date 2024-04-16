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
export class ButtonComponent extends Component {
    constructor() {
        super(...arguments);
        this._content = this.element.getAttribute("data-content");
        this._count = 0;
    }
    onInit() {
        console.log("Button Component Initializing");
        this.element.setAttribute("data-count", this._count.toString());
    }
    onAppear() {
        console.log("Button Component appeared");
    }
    onClick(_) {
        console.log("Button component clicked");
        this.element.setAttribute("data-count", String(this._count + 1));
    }
    onUpdate() {
        console.log("Button component updated");
    }
    onDestroy() {
        console.log("Button component destroyed");
    }
    onMorph(toElement) {
        console.log("Button component morphing to: ", toElement);
        toElement.setAttribute("data-count", this._count.toString());
    }
    onAttributeChanged(attribute, oldValue, newValue) {
        console.log(`Button component ${attribute} attribute changed from ${oldValue} to ${newValue}`);
        if (attribute === "data-count") {
            const newCount = parseInt(newValue);
            if (this._count !== newCount) {
                this._count = newCount;
            }
            if (this._count >= 10) {
                this.element.remove();
            }
        }
    }
    render() {
        console.log("Button component rendering");
        return `
            <button class="btn btn-primary">
                ${escape(this._content)}${this._count === 0 ? "" : ": " + escape(this._count)}
            </button>
        `;
    }
}
_a = ButtonComponent;
ButtonComponent.definition = _a.define("button-component");
__decorate([
    State,
    __metadata("design:type", Number)
], ButtonComponent.prototype, "_count", void 0);
