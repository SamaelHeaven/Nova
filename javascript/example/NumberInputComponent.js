import { Component, Validation } from "../nova/lib.js";
export class NumberInputComponent extends Component {
    constructor() {
        super(...arguments);
        this._min = Number(this.getAttribute("data-min", "0"));
        this._max = Number(this.getAttribute("data-max", `${Infinity}`));
    }
    onInput(event) {
        const inputElement = event.target;
        const inputValue = inputElement.value.trim();
        let numericValue = inputValue.replace(/\D/g, "");
        while (numericValue.charAt(0) === "0") {
            numericValue = numericValue.substring(1);
        }
        if (Validation.notEmpty(numericValue) && Validation.numberRange(Number(numericValue), this._min, this._max)) {
            inputElement.value = numericValue;
            return;
        }
        if (!Validation.numberMin(Number(numericValue), this._min)) {
            inputElement.value = this._min.toString();
            return;
        }
        if (!Validation.numberMax(Number(numericValue), this._max)) {
            inputElement.value = this._max.toString();
            return;
        }
        inputElement.value = this._min.toString();
    }
    render() {
        return `
            <input id="number-input-${this.id}" 
                   class="form-control"
                   type="text"
                   value="${this._min}"
                   aria-label="Enter a number" 
                   placeholder="Enter a number">
        `;
    }
}
