import {Events} from "./Events.js";
import {Application} from "./Application.js";

export abstract class Component {
    /** @internal */
    private readonly _element: HTMLElement;

    constructor(element: HTMLElement) {
        this._element = element;
    }

    public render(): string | undefined {
        return undefined;
    }

    public get id(): string {
        return this._element.id;
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public getAttribute(name: string, defaultValue: string | null = null): string | null {
        const attribute: Attr = this._element.attributes.getNamedItem(name);
        if (attribute) {
            return attribute.value;
        }

        return defaultValue;
    }

    public update(state: object): void {
        for (const key of this.getKeys()) {
            if (this[key] === state) {
                this[key] = state;
            }
        }
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

    public getComponentById<T extends Component>(id: string): T | null {
        return Application.getComponentById(id);
    }

    public getComponentByClass<T extends Component>(clazz: (new (...args: any[]) => T), element?: HTMLElement): T | null {
        return Application.getComponentByClass(clazz, element);
    }

    public getComponentsByClass<T extends Component>(clazz: (new (...args: any[]) => T), element?: HTMLElement): T[] {
        return Application.getComponentsByClass(clazz, element);
    }

    public onInit(): void {}

    public onClick(event: Events.Mouse): void {}

    public onDblClick(event: Events.Mouse): void {}

    public onMouseDown(event: Events.Mouse): void {}

    public onMouseUp(event: Events.Mouse): void {}

    public onMouseMove(event: Events.Mouse): void {}

    public onMouseEnter(event: Events.Mouse): void {}

    public onMouseLeave(event: Events.Mouse): void {}

    public onMouseOver(event: Events.Mouse): void {}

    public onMouseOut(event: Events.Mouse): void {}

    public onKeyDown(event: Events.Keyboard): void {}

    public onKeyPress(event: Events.Keyboard): void {}

    public onKeyUp(event: Events.Keyboard): void {}

    public onFocus(event: Events.Focus): void {}

    public onBlur(event: Events.Focus): void {}

    public onInput(event: Events.Input): void {}

    public onChange(event: Events.BaseEvent): void {}

    public onSubmit(event: Events.BaseEvent): void {}

    public onScroll(event: Events.BaseEvent): void {}

    public onError(event: Events.Error): void {}

    public onResize(event: Events.UI): void {}

    public onSelect(event: Events.BaseEvent): void {}

    public onTouchStart(event: Events.Touch): void {}

    public onTouchMove(event: Events.Touch): void {}

    public onTouchEnd(event: Events.Touch): void {}

    public onTouchCancel(event: Events.Touch): void {}

    public onAnimationStart(event: Events.Animation): void {}

    public onAnimationEnd(event: Events.Animation): void {}

    public onAnimationIteration(event: Events.Animation): void {}

    public onTransitionStart(event: Events.Transition): void {}

    public onTransitionEnd(event: Events.Transition): void {}

    public onTransitionCancel(event: Events.Transition): void {}
}