var _a;
import { Component, escape } from "../nova/lib.js";
export class NumberInputComponent extends Component {
    constructor() {
        super(...arguments);
        this._min = Number(this.element.getAttribute("data-min") || "0");
        this._max = Number(this.element.getAttribute("data-max") || Infinity.toString());
    }
    onInput(event) {
        const inputElement = event.target;
        const inputValue = inputElement.value.trim();
        let numericValue = inputValue.replace(/\D/g, "");
        while (numericValue.charAt(0) === "0") {
            numericValue = numericValue.substring(1);
        }
        if (numericValue.length > 0 && Number(numericValue) >= this._min && Number(numericValue) <= this._max) {
            inputElement.value = numericValue;
            return;
        }
        if (Number(numericValue) <= this._min) {
            inputElement.value = this._min.toString();
            return;
        }
        if (Number(numericValue) >= this._max) {
            inputElement.value = this._max.toString();
            return;
        }
        inputElement.value = this._min.toString();
    }
    render() {
        return `
            <input id="number-input"
                   class="form-control"
                   type="text"
                   value="${escape(this._min)}"
                   aria-label="Enter a number" 
                   placeholder="Enter a number">
        `;
    }
}
_a = NumberInputComponent;
NumberInputComponent.definition = _a.define("number-input-component");
