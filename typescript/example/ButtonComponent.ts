import {Component, ComponentDefinition, Html, State} from "../nova/lib.js";

export class ButtonComponent extends Component {
    public static readonly definition: ComponentDefinition = {tag: "button-component", ctor: this}
    @State private _count: number = 0;

    public override render(): Html {
        return "button".html()
            .class("btn btn-primary")
            .text(this._count > 0 ? `Count: ${this._count}!` : "Click Me!")
            .on("click", () => this._count++);
    }
}