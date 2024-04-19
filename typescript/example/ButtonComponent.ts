import {Component, ComponentDefinition, escapeHTML, Events, State} from "../nova/lib.js";

export class ButtonComponent extends Component {
    public static readonly definition: ComponentDefinition = this.define("button-component");
    private _content: string = this.element.getAttribute("data-content");
    @State private _count: number = 0;

    public override onInit(): void {
        console.log("Button Component Initializing");
        this.element.setAttribute("data-count", this._count.toString())
    }

    public override onAppear(): void {
        console.log("Button Component appeared");
    }

    public override onClick(_: Events.Mouse): void {
        console.log("Button component clicked");
        this.element.setAttribute("data-count", String(this._count + 1));
    }

    public override onUpdate(): void {
        console.log("Button component updated");
    }

    public override onDestroy(): void {
        console.log("Button component destroyed");
    }

    public override onMorph(toElement: HTMLElement): void {
        console.log("Button component morphing to: ", toElement);
        toElement.setAttribute("data-count", this._count.toString());
    }

    public override onAttributeChanged(attribute: string, oldValue: string, newValue: string): void {
        console.log(`Button component ${attribute} attribute changed from ${oldValue} to ${newValue}`);
        if (attribute === "data-count") {
            const newCount: number = parseInt(newValue);
            if (this._count !== newCount) {
                this._count = newCount;
            }

            if (this._count >= 10) {
                this.element.remove();
            }
        }
    }

    public override render(): string {
        return `
            <button class="btn btn-primary">
                ${escapeHTML(this._content)}${this._count === 0 ? "" : ": " + escapeHTML(this._count)}
            </button>
        `;
    }
}