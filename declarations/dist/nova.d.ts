declare global {
    interface String {
        escape(): string;
    }
    interface Date {
        format(format: string): string;
    }
}
export declare class Application {
    private constructor();
    static launch(components: ComponentDefinition[]): void;
    static updateComponent(component: Component): void;
    static queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    static queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
}
export declare abstract class Component {
    readonly element: HTMLElement;
    readonly initialized: boolean;
    readonly keys: string[];
    constructor(element: HTMLElement);
    protected static define(tag: string): ComponentDefinition;
    render(): string;
    update(): void;
    updateState(state: object): void;
    useUpdate(callback: () => void): void;
    useUpdateAsync(callback: () => Promise<void>): void;
    queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
    onInit(): void | Promise<void>;
    onAppear(): void;
    onDestroy(): void;
    onMorph(toElement: HTMLElement): void;
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
    onChange(event: Events.BaseEvent): any;
    onSubmit(event: Events.BaseEvent): any;
    onScroll(event: Events.BaseEvent): any;
    onError(event: Events.Error): any;
    onResize(event: Events.UI): any;
    onSelect(event: Events.BaseEvent): any;
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
export type ComponentConstructor = (new (element: HTMLElement) => Component);
export type ComponentDefinition = {
    tag: string;
    ctor: ComponentConstructor;
};
export declare class Debounce {
    constructor(callback: Function, wait: number);
    call(...args: any[]): void;
}
export declare namespace Events {
    type BaseEvent = Event & {
        target: HTMLElement;
        currentTarget: HTMLElement;
        relatedTarget: HTMLElement;
    };
    type Mouse = MouseEvent & BaseEvent;
    type Keyboard = KeyboardEvent & BaseEvent;
    type Focus = FocusEvent & BaseEvent;
    type Input = InputEvent & BaseEvent;
    type Error = ErrorEvent & BaseEvent;
    type UI = UIEvent & BaseEvent;
    type Touch = TouchEvent & BaseEvent;
    type Animation = AnimationEvent & BaseEvent;
    type Transition = TransitionEvent & BaseEvent;
}
export declare namespace LocalStorage {
    function getItem<T>(key: string): T | null;
    function setItem<T>(key: string, value: T, ttl?: number | undefined): void;
}
export declare function State(target: Component, key: string): void;
