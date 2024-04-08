import {Component, Debounce, Events, State, Validation} from "../nova/lib.js";

export class EmailInputComponent extends Component {
    @State private _valid: boolean = false;
    private readonly _inputDebounce: Debounce = new Debounce(this._onDebounceInput.bind(this), 300);

    public override onInput(event: Events.Input): void {
        this._inputDebounce.call(event);
    }

    public override render(): string {
        return `
            <form>
                <label for="email-input-${this.id}">Email</label>
                <input type="email" id="email-input-${this.id}" class="form-control mt-2" placeholder="Email">
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

    private _onDebounceInput(event: Events.Input): void {
        this._valid = Validation.isEmail((event.target as HTMLInputElement).value.trim());
    }
}