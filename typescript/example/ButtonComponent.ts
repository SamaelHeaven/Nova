import {Component, Events, State} from "../nova/lib.js";

export class ButtonComponent extends Component {
    @State private _content: string = super.input("content");
    @State private _count: number = 0;

    public onClick(_: Events.Mouse): void {
        this._count++;
        console.log("Clicked!")
    }

    public render(): string {
        return `
            <button>
                ${this._content}${this._count === 0 ? "" : ": " + this._count}
            </button>
        `;
    }
}