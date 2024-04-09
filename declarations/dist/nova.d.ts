export declare class Application {
    private constructor();
    static launch(components: ComponentDefinition[]): void;
    static updateComponent(component: Component): void;
    static queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    static queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
}
export declare abstract class Component {
    readonly element: HTMLElement;
    constructor(element: HTMLElement);
    render(): string | undefined;
    update(state: object): void;
    queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
    onInit(): void;
    onAppear(): void;
    onUpdate(): void;
    onDestroy(): void;
    onAttributeChanged(attribute: string, oldValue: string, newValue: string): void;
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
    onChange(event: Events.BaseEvent): void;
    onSubmit(event: Events.BaseEvent): void;
    onScroll(event: Events.BaseEvent): void;
    onError(event: Events.Error): void;
    onResize(event: Events.UI): void;
    onSelect(event: Events.BaseEvent): void;
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
export type ComponentConstructor = (new (element: HTMLElement) => Component);
export type ComponentDefinition = {
    tagName: string;
    constructor: ComponentConstructor;
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
export declare namespace Format {
    function date(value: Date | number | string | undefined, format: string): string;
    function titleCase(value: string): string;
    function upperCase(value: string): string;
    function lowerCase(value: string): string;
    function json(value: object): string;
    function percentage(value: number, digits?: number): string;
    function decimal(value: number, digits?: number): string;
    function currency(value: number, currency?: string): string;
}
export declare namespace LocalStorage {
    function getItem<T>(key: string): T | null;
    function setItem<T>(key: string, value: T, ttl?: number | undefined): void;
}
export declare function State(target: any, key: string): void;
export declare namespace Validation {
    function isEmail(email: string): boolean;
    function isPhoneNumber(phoneNumber: string): boolean;
    function isDateEquals(date: Date, expected: Date): boolean;
    function isDateAfter(date: Date, minDate: Date): boolean;
    function isDateBefore(date: Date, maxDate: Date): boolean;
    function isDateBetween(date: Date, minDate: Date, maxDate: Date): boolean;
    function isPositiveInteger(value: string): boolean;
    function isNegativeInteger(value: string): boolean;
    function isInteger(value: string): boolean;
    function isPositiveNumeric(value: string): boolean;
    function isNegativeNumeric(value: string): boolean;
    function isNumeric(value: string): boolean;
    function isInRange(value: number, min: number, max: number): boolean;
    function isString(value: any): boolean;
    function isNumber(value: any): boolean;
    function isFiniteNumber(value: any): boolean;
    function isBoolean(value: any): boolean;
    function isArray(value: any): boolean;
    function isNull(value: any): boolean;
    function isUndefined(value: any): boolean;
    function isNullOrUndefined(value: any): boolean;
    function isNullOrUndefinedOrEmpty(value: null | undefined | {
        length: number;
    }): boolean;
    function isJson(value: string): boolean;
    function isNan(value: number): boolean;
    function isInfinity(value: number): boolean;
    function isRegex(value: string, regex: RegExp): boolean;
    function isEmpty(value: {
        length: number;
    }): boolean;
}
