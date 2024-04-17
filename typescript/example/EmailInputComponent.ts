import {Component, ComponentDefinition, escape, Events, State} from "../nova/lib.js";

export class EmailInputComponent extends Component {
    public static readonly definition: ComponentDefinition = this.define("email-input-component");
    @State public email: string = "";

    public override onSubmit(event: Events.Base): void {
        event.preventDefault();
    }

    public override render(): string {
        const valid: boolean = this._valid;
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

    private get _valid() {
        return !!this.email.trim().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }
}