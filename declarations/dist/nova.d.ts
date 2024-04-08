export declare class Application {
    private constructor();
    static launch(components: {
        name: string;
        class: (new (...args: any[]) => Component);
    }[]): void;
    static updateComponent(component: Component): void;
    static getComponent<T extends Component>(clazz: (new (...args: any[]) => T), element?: HTMLElement): T | null;
    static getComponents<T extends Component>(clazz: (new (...args: any[]) => T), element?: HTMLElement): T[];
}
export declare abstract class Component {
    constructor(element: HTMLElement);
    render(): string | undefined;
    get element(): HTMLElement;
    update(state: object): void;
    getComponent<T extends Component>(clazz: (new (...args: any[]) => T), element?: HTMLElement): T | null;
    getComponents<T extends Component>(clazz: (new (...args: any[]) => T), element?: HTMLElement): T[];
    onInit(): void;
    onAppear(): void;
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
    function date(arg: Date | undefined | null | number | string | "today" | "tomorrow" | "yesterday", format: string): string;
    function titleCase(arg: any): string;
    function upperCase(arg: any): string;
    function lowerCase(arg: any): string;
    function percentage(arg: any, digits: number): string;
    function decimal(arg: any, digits: number): string;
    function currency(amount: number, currency?: string): string;
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
    function isBoolean(value: any): boolean;
    function isArray(value: any): boolean;
    function isJson(value: string): boolean;
    function isFiniteNumber(value: any): boolean;
    function isNan(value: number): boolean;
    function isInfinity(value: number): boolean;
    function isRegex(value: string, regex: RegExp): boolean;
    function isEmpty(value: {
        length: number;
    }): boolean;
    function isNull(value: any): boolean;
    function isUndefined(value: any): boolean;
    function isNullOrUndefined(value: any): boolean;
    function isNullOrUndefinedOrEmpty(value: null | undefined | {
        length: number;
    }): boolean;
}
