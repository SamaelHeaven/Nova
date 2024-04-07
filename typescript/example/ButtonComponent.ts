import {Component, Events, State} from "../nova/lib.js";

export class ButtonComponent extends Component {
    private _content: string = this.getAttribute("data-content");
    @State private count: number = 0;

    public onInit(): void {
        console.log("Initializing Button Component")
    }

    public onClick(_: Events.Mouse): void {
        this.count++;
        console.log("Clicked!");
    }

    public render(): string {
        return `
            <button>
                ${this._content}${this.count === 0 ? "" : ": " + this.count}
            </button>
        `;
    }
}