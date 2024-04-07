import {Events} from "./Events.js";

export abstract class Component {
    constructor(public readonly element: HTMLElement) {}

    public abstract render(): string;

    public input(key: string, defaultValue: string | null = null): string | null {
        const attribute: Attr = this.element.attributes.getNamedItem(key);
        if (attribute) {
            return attribute.value;
        }

        return defaultValue;
    }

    public update(value: object): void {
        for (const key of this.getKeys()) {
            if (this[key] === value) {
                this[key] = value;
            }
        }
    }

    public getKeys(): string[] {
        let keys: string[] = [];
        let prototype = this;
        while (prototype) {
            const parentPrototype = Object.getPrototypeOf(prototype);
            if (parentPrototype && Object.getPrototypeOf(parentPrototype)) {
                keys = keys.concat(Object.getOwnPropertyNames(prototype));
            }

            prototype = parentPrototype;
        }

        keys = [...new Set(keys)];
        return keys;
    }

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

    public onChange(event: Events.Normal): void {}

    public onSubmit(event: Events.Normal): void {}

    public onScroll(event: Events.Normal): void {}

    public onLoad(event: Events.Normal): void {}

    public onUnload(event: Events.Normal): void {}

    public onError(event: Events.Error): void {}

    public onResize(event: Events.UI): void {}

    public onSelect(event: Events.Normal): void {}

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