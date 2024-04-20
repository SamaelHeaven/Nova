declare global {
    interface Date {
        format(format: string): string;
    }
    interface HTMLElement {
        appComponent?: {
            instance: Component;
            dirty: boolean;
        };
    }
}
export declare class Application {
    private constructor();
    static launch(componentDefinitions: ComponentDefinition[]): void;
    static updateComponent(component: Component): void;
    static queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    static queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
    static closestComponent<T extends Component>(selector: string, element: HTMLElement): T | null;
}
export declare abstract class Component {
    readonly uuid: string;
    readonly element: HTMLElement;
    readonly initialized: boolean;
    readonly appeared: boolean;
    readonly keys: ReadonlyArray<string>;
    readonly subscribers: [Component | (() => void), keyof this & string][];
    shouldUpdate: boolean;
    constructor(element: HTMLElement);
    static define(tag: string): ComponentDefinition;
    render(): string;
    update(before?: () => void | Promise<void>): void;
    on(event: keyof GlobalEventHandlersEventMap, call: keyof this & string): string;
    bind(key: keyof this & string): string;
    queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
    closestComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    onInit(): void | Promise<void>;
    onAppear(): void;
    onUpdate(): void;
    onDestroy(): void;
    onMorph(toElement: HTMLElement): void | boolean;
    onAttributeChanged(attribute: string, oldValue: string, newValue: string): void;
    onClick(event: Events.Mouse): any;
    onDblClick(event: Events.Mouse): any;
    onMouseDown(event: Events.Mouse): any;
    onMouseUp(event: Events.Mouse): any;
    onMouseMove(event: Events.Mouse): any;
    onMouseEnter(event: Events.Mouse): any;
    onMouseLeave(event: Events.Mouse): any;
    onMouseOver(event: Events.Mouse): any;
    onMouseOut(event: Events.Mouse): any;
    onKeyDown(event: Events.Keyboard): any;
    onKeyPress(event: Events.Keyboard): any;
    onKeyUp(event: Events.Keyboard): any;
    onFocus(event: Events.Focus): any;
    onBlur(event: Events.Focus): any;
    onInput(event: Events.Input): any;
    onChange(event: Events.Base): any;
    onSubmit(event: Events.Base): any;
    onScroll(event: Events.Base): any;
    onError(event: Events.Error): any;
    onResize(event: Events.UI): any;
    onSelect(event: Events.Base): any;
    onTouchStart(event: Events.Touch): any;
    onTouchMove(event: Events.Touch): any;
    onTouchEnd(event: Events.Touch): any;
    onTouchCancel(event: Events.Touch): any;
    onAnimationStart(event: Events.Animation): any;
    onAnimationEnd(event: Events.Animation): any;
    onAnimationIteration(event: Events.Animation): any;
    onTransitionStart(event: Events.Transition): any;
    onTransitionEnd(event: Events.Transition): any;
    onTransitionCancel(event: Events.Transition): any;
}
export type ComponentDefinition = {
    tag: string;
    ctor: (new (element: HTMLElement) => Component);
};
export declare class Debounce {
    constructor(callback: Function, wait: number);
    call(...args: any[]): void;
}
export declare function escapeHTML(value: {
    toString(): string;
}): string;
export declare function Event(type: keyof GlobalEventHandlersEventMap): <T extends Component>(_: T, key: keyof T & string, propertyDescriptor: TypedPropertyDescriptor<(event?: Events.Base) => void>) => {
    get: () => (event?: Events.Base) => void;
    enumerable: boolean;
    configurable: boolean;
};
export declare namespace Events {
    type Base<T extends HTMLElement = HTMLElement> = Event & {
        target: T;
    };
    type Mouse<T extends HTMLElement = HTMLElement> = MouseEvent & Base<T>;
    type Keyboard<T extends HTMLElement = HTMLElement> = KeyboardEvent & Base<T>;
    type Focus<T extends HTMLElement = HTMLElement> = FocusEvent & Base<T>;
    type Input<T extends HTMLElement = HTMLElement> = InputEvent & Base<T>;
    type Error<T extends HTMLElement = HTMLElement> = ErrorEvent & Base<T>;
    type UI<T extends HTMLElement = HTMLElement> = UIEvent & Base<T>;
    type Touch<T extends HTMLElement = HTMLElement> = TouchEvent & Base<T>;
    type Animation<T extends HTMLElement = HTMLElement> = AnimationEvent & Base<T>;
    type Transition<T extends HTMLElement = HTMLElement> = TransitionEvent & Base<T>;
}
export declare namespace LocalStorage {
    function getItem<T>(key: string): T | null;
    function setItem<T>(key: string, value: T, ttl?: number): void;
}
export declare function State<T extends Component>(target: T, key: string): void;
