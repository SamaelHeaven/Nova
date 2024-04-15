import {Application} from "./Application.js";
import {Html} from "./Html.js";

export abstract class Component {
    public readonly element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    public render(): Html {
        return undefined;
    }

    public onInit(): void | Promise<void> {}

    public onAppear(): void {}

    public onUpdate(): void {}

    public onDestroy(): void {}

    public onMorph(toElement: HTMLElement): void {}

    public onAttributeChanged(attribute: string, oldValue: string, newValue: string): void {}

    public update(state: object): void {
        for (const key of this.getKeys()) {
            if (this[key] === state) {
                this[key] = state;
            }
        }
    }

    public queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null {
        return Application.queryComponent<T>(selector, element);
    }

    public queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[] {
        return Application.queryComponents<T>(selector, element);
    }

    public getKeys(): string[] {
        let keys: string[] = [];
        let currentPrototype = this;
        while (currentPrototype) {
            const parentPrototype = Object.getPrototypeOf(currentPrototype);
            if (parentPrototype && Object.getPrototypeOf(parentPrototype)) {
                keys = keys.concat(Object.getOwnPropertyNames(currentPrototype));
            }

            currentPrototype = parentPrototype;
        }

        return [...new Set(keys)];
    }
}