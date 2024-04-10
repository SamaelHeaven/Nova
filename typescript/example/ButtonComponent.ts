import {Component, ComponentDefinition, Events, State} from "../nova/lib.js";

export class ButtonComponent extends Component {
    public static readonly definition: ComponentDefinition = {tagName: "button-component", constructor: this}
    private _content: string = this.element.getAttribute("data-content");
    @State private _count: number = 0;

    public override onInit(): void {
        console.log("Initializing Button Component");
    }

    public override onAppear(): void {
        console.log("Button Component Appeared");
    }

    public override onUpdate(): void {
        console.log("Button Component Updated");
    }

    public override onClick(_: Events.Mouse): void {
        this.element.setAttribute("data-count", String(this._count + 1));
        console.log("Clicked!");
    }

    public override onDestroy(): void {
        console.log("Button Component Destroyed");
    }

    public override onMorph(toElement: HTMLElement): void {
        console.log("Morphing to: ", toElement);
    }

    public override onAttributeChanged(attribute: string, oldValue: string, newValue: string): void {
        console.log(`${attribute} attribute changed from ${oldValue} to ${newValue}`);
        if (attribute === "data-count") {
            this._count = parseInt(newValue);

            if (this._count >= 10) {
                this.element.remove();
            }
        }
    }

    public override render(): string {
        return `
            <button class="btn btn-primary">
                ${this._content}${this._count === 0 ? "" : ": " + this._count}
            </button>
        `;
    }
}