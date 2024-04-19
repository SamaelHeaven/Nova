import {Component, ComponentDefinition, escapeHTML, Events} from "../nova/lib.js";

export class NumberInputComponent extends Component {
    public static readonly definition: ComponentDefinition = this.define("number-input-component");
    private _min: number = Number(this.element.getAttribute("data-min") || "0");
    private _max: number = Number(this.element.getAttribute("data-max") || Infinity.toString());

    public onInput(event: Events.Input<HTMLInputElement>): void {
        const inputElement: HTMLInputElement = event.target;
        const inputValue: string = inputElement.value.trim();
        let numericValue: string = inputValue.replace(/\D/g, "");
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

    public override render(): string {
        return `
            <input id="number-input"
                   class="form-control"
                   type="text"
                   value="${escapeHTML(this._min)}"
                   aria-label="Enter a number" 
                   placeholder="Enter a number">
        `;
    }
}