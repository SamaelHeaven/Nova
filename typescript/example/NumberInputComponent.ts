import {Component, Events, Validation} from "../nova/lib.js";

export class NumberInputComponent extends Component {
    private _min: number = Number(this.getAttribute("data-min", "0"));
    private _max: number = Number(this.getAttribute("data-max", `${Infinity}`));

    public onInput(event: Events.Input): void {
        const inputElement: HTMLInputElement = event.target as HTMLInputElement;
        const inputValue: string = inputElement.value.trim();
        let numericValue: string = inputValue.replace(/\D/g, "");
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

    public override render(): string {
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