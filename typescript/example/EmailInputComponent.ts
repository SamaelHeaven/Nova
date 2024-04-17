import {Component, ComponentDefinition, Debounce, Events, State} from "../nova/lib.js";

export class EmailInputComponent extends Component {
    public static readonly definition: ComponentDefinition = this.define("email-input-component");
    @State private _valid: boolean = false;
    private readonly _inputDebounce: Debounce = new Debounce(this._onDebounceInput.bind(this), 300);

    public override onInput(event: Events.Input<HTMLInputElement>): void {
        this._inputDebounce.call(event);
    }

    public override render(): string {
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

    private _onDebounceInput(event: Events.Input<HTMLInputElement>): void {
        this._valid = !!event.target.value.trim().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }
}