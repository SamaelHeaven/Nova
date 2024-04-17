import {Events} from "./Events.js";
import {Application} from "./Application.js";
import {ComponentDefinition} from "./ComponentDefinition.js";
import {ComponentConstructor} from "./ComponentConstructor.js";

export abstract class Component {
    public readonly uuid: string;
    public readonly element: HTMLElement;
    public readonly initialized: boolean;
    public readonly appeared: boolean;
    public readonly keys: ReadonlyArray<string>;
    public readonly subscribers: [Component | (() => void), keyof this][];
    public shouldUpdate: boolean;

    constructor(element: HTMLElement) {
        this.uuid = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (value: string) =>
            (+value ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +value / 4).toString(16)
        );

        this.element = element;
        this.initialized = false;
        this.appeared = false;
        this.subscribers = [];
        this.shouldUpdate = true;
        let keys: string[] = [];
        let currentPrototype = this;
        while (currentPrototype) {
            const parentPrototype = Object.getPrototypeOf(currentPrototype);
            if (parentPrototype && Object.getPrototypeOf(parentPrototype)) {
                keys = keys.concat(Object.getOwnPropertyNames(currentPrototype));
            }

            currentPrototype = parentPrototype;
        }

        this.keys = [...new Set(keys)];
    }

    protected static define(tag: string): ComponentDefinition {
        return {tag, ctor: this as unknown as ComponentConstructor};
    }

    public render(): string {
        return "";
    }

    public update(before?: () => void | Promise<void>): void {
        if (before) {
            const shouldUpdate: boolean = this.shouldUpdate;
            this.shouldUpdate = false;
            const beforeResult: void | Promise<void> = before();
            if (beforeResult instanceof Promise) {
                beforeResult.then((): void => {
                    this.shouldUpdate = shouldUpdate;
                    Application.updateComponent(this);
                });
                return;
            } else {
                this.shouldUpdate = shouldUpdate;
            }
        }

        Application.updateComponent(this);
    }

    public on(event: keyof GlobalEventHandlersEventMap, key: keyof this): string {
        return `data-event="${this.uuid};${event};${key as string}"`;
    }

    public queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null {
        return Application.queryComponent<T>(selector, element);
    }

    public queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[] {
        return Application.queryComponents<T>(selector, element);
    }

    public onInit(): void | Promise<void> {}

    public onAppear(): void {}

    public onUpdate(): void {}

    public onDestroy(): void {}

    public onMorph(toElement: HTMLElement): void {}

    public onAttributeChanged(attribute: string, oldValue: string, newValue: string): void {}

    public onClick(event: Events.Mouse): any {}

    public onDblClick(event: Events.Mouse): any {}

    public onMouseDown(event: Events.Mouse): any {}

    public onMouseUp(event: Events.Mouse): any {}

    public onMouseMove(event: Events.Mouse): any {}

    public onMouseEnter(event: Events.Mouse): any {}

    public onMouseLeave(event: Events.Mouse): any {}

    public onMouseOver(event: Events.Mouse): any {}

    public onMouseOut(event: Events.Mouse): any {}

    public onKeyDown(event: Events.Keyboard): any {}

    public onKeyPress(event: Events.Keyboard): any {}

    public onKeyUp(event: Events.Keyboard): any {}

    public onFocus(event: Events.Focus): any {}

    public onBlur(event: Events.Focus): any {}

    public onInput(event: Events.Input): any {}

    public onChange(event: Events.Base): any {}

    public onSubmit(event: Events.Base): any {}

    public onScroll(event: Events.Base): any {}

    public onError(event: Events.Error): any {}

    public onResize(event: Events.UI): any {}

    public onSelect(event: Events.Base): any {}

    public onTouchStart(event: Events.Touch): any {}

    public onTouchMove(event: Events.Touch): any {}

    public onTouchEnd(event: Events.Touch): any {}

    public onTouchCancel(event: Events.Touch): any {}

    public onAnimationStart(event: Events.Animation): any {}

    public onAnimationEnd(event: Events.Animation): any {}

    public onAnimationIteration(event: Events.Animation): any {}

    public onTransitionStart(event: Events.Transition): any {}

    public onTransitionEnd(event: Events.Transition): any {}

    public onTransitionCancel(event: Events.Transition): any {}
}