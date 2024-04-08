export declare class Application {
    private constructor();
    static launch(componentClasses: (new (...args: any[]) => Component)[]): void;
    static update(component: Component): void;
    static getComponentById<T extends Component>(id: string): T | null;
    static getComponentByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T | null;
    static getComponentsByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T[];
}
export declare abstract class Component {
    constructor(element: HTMLElement);
    render(): string | null;
    get id(): string;
    get element(): HTMLElement;
    getAttribute(name: string, defaultValue?: string | null): string | null;
    update(state: object): void;
    getKeys(): string[];
    getComponentById<T extends Component>(id: string): T | null;
    getComponentByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T | null;
    getComponentsByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T[];
    onInit(): void;
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
    function currency(amount: number, code?: string): string;
}
export declare class LocalStorage {
    static getItem<T>(key: string): T | null;
    static setItem<T>(key: string, value: T, ttl?: number | undefined): void;
}
export declare function State(target: any, key: string): void;
export declare namespace Validation {
    function equals(value: any, expected: any): boolean;
    function notEquals(value: any, expected: any): boolean;
    function email(email: string): boolean;
    function phoneNumber(phoneNumber: string): boolean;
    function date(date: Date, expected: Date): boolean;
    function dateMin(date: Date, minDate: Date): boolean;
    function dateMax(date: Date, maxDate: Date): boolean;
    function dateRange(date: Date, minDate: Date, maxDate: Date): boolean;
    function positiveInteger(value: string): boolean;
    function negativeInteger(value: string): boolean;
    function integer(value: string): boolean;
    function positiveNumeric(value: string): boolean;
    function negativeNumeric(value: string): boolean;
    function numeric(value: string): boolean;
    function numberMin(value: number, min: number): boolean;
    function numberMax(value: number, max: number): boolean;
    function numberRange(value: number, min: number, max: number): boolean;
    function isString(value: any): boolean;
    function isNumber(value: any): boolean;
    function notNaN(value: number): boolean;
    function isNan(value: number): boolean;
    function notInfinity(value: number): boolean;
    function isInfinity(value: number): boolean;
    function regex(value: string, regex: RegExp): boolean;
    function length(value: {
        length: number;
    }, expectedLength: number): boolean;
    function lengthMin(value: {
        length: number;
    }, minLength: number): boolean;
    function lengthMax(value: {
        length: number;
    }, maxLength: number): boolean;
    function lengthRange(value: {
        length: number;
    }, minLength: number, maxLength: number): boolean;
    function isEmpty(value: {
        length: number;
    }): boolean;
    function notEmpty(value: {
        length: number;
    }): boolean;
    function isNull(value: any): boolean;
    function notNull(value: any): boolean;
    function isUndefined(value: any): boolean;
    function notUndefined(value: any): boolean;
    function notNullOrUndefined(value: any): boolean;
    function isNullOrUndefined(value: any): boolean;
    function notNullOrUndefinedOrEmpty(value: null | undefined | {
        length: number;
    }): boolean;
    function isNullOrUndefinedOrEmpty(value: null | undefined | {
        length: number;
    }): boolean;
}
