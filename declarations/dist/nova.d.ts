export declare class Application {
    private constructor();
    static launch(components: (new (...args: any[]) => Component)[]): void;
    static update(component: Component): void;
    static getComponent<T extends Component>(clazz: (new (...args: any[]) => T)): T | null;
    static getComponents<T extends Component>(clazz: (new (...args: any[]) => T)): T[];
}
export declare abstract class Component {
    readonly element: HTMLElement;
    constructor(element: HTMLElement);
    abstract render(): string;
    input(key: string, defaultValue?: string | null): string | null;
    update(value: object): void;
    getKeys(): string[];
    onClick(event: Events.Mouse): void;
    onDblClick(event: Events.Mouse): void;
    onMouseDown(event: Events.Mouse): void;
    onMouseUp(event: Events.Mouse): void;
    onMouseMove(event: Events.Mouse): void;
    onMouseEnter(event: Events.Mouse): void;
    onMouseLeave(event: Events.Mouse): void;
    onMouseOver(event: Events.Mouse): void;
    onMouseOut(event: Events.Mouse): void;
    onKeyDown(event: Events.Keyboard): void;
    onKeyPress(event: Events.Keyboard): void;
    onKeyUp(event: Events.Keyboard): void;
    onFocus(event: Events.Focus): void;
    onBlur(event: Events.Focus): void;
    onInput(event: Events.Input): void;
    onChange(event: Events.Normal): void;
    onSubmit(event: Events.Normal): void;
    onScroll(event: Events.Normal): void;
    onLoad(event: Events.Normal): void;
    onUnload(event: Events.Normal): void;
    onError(event: Events.Error): void;
    onResize(event: Events.UI): void;
    onSelect(event: Events.Normal): void;
    onTouchStart(event: Events.Touch): void;
    onTouchMove(event: Events.Touch): void;
    onTouchEnd(event: Events.Touch): void;
    onTouchCancel(event: Events.Touch): void;
    onAnimationStart(event: Events.Animation): void;
    onAnimationEnd(event: Events.Animation): void;
    onAnimationIteration(event: Events.Animation): void;
    onTransitionStart(event: Events.Transition): void;
    onTransitionEnd(event: Events.Transition): void;
    onTransitionCancel(event: Events.Transition): void;
}
export declare namespace Events {
    type Target = {
        target: HTMLElement;
    };
    export type Mouse = MouseEvent & Target;
    export type Keyboard = KeyboardEvent & Target;
    export type Focus = FocusEvent & Target;
    export type Input = InputEvent & Target;
    export type Normal = Event & Target;
    export type Error = ErrorEvent & Target;
    export type UI = UIEvent & Target;
    export type Touch = TouchEvent & Target;
    export type Animation = AnimationEvent & Target;
    export type Transition = TransitionEvent & Target;
    export {};
}
export declare class LocalStorage {
    static getItem<T>(key: string): T | null;
    static setItem<T>(key: string, value: T, ttl?: number | undefined): void;
}
export declare function State(target: any, key: string): void;
