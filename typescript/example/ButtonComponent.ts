import {Component, Events, State} from "../nova/lib.js";

export class ButtonComponent extends Component {
    private _content: string = this.element.getAttribute("data-content");
    @State private _count: number = 0;

    public override onInit(): void {
        console.log("Initializing Button Component");
    }

    public onAppear(): void {
        console.log("Button Component Appeared");
    }

    public onAttributeChanged(attribute: string, _: string, newValue: string): void {
        if (attribute === "data-count") {
            this._count = parseInt(newValue);
            console.log("Attribute changed!");

            if (this._count >= 10) {
                this.element.remove();
            }
        }
    }

    public override onClick(_: Events.Mouse): void {
        this.element.setAttribute("data-count", String(this._count + 1));
        console.log("Clicked!");
    }

    public onDestroy(): void {
        console.log("Component Destroyed!");
    }

    public override render(): string {
        return `
            <button class="btn btn-primary">
                ${this._content}${this._count === 0 ? "" : ": " + this._count}
            </button>
        `;
    }
}