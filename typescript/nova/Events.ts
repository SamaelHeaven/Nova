export namespace Events {
    export type Base<T extends HTMLElement = HTMLElement> = Event & { target: T }
    export type Mouse<T extends HTMLElement = HTMLElement> = MouseEvent & Base<T>;
    export type Keyboard<T extends HTMLElement = HTMLElement> = KeyboardEvent & Base<T>;
    export type Focus<T extends HTMLElement = HTMLElement> = FocusEvent & Base<T>;
    export type Input<T extends HTMLElement = HTMLElement> = InputEvent & Base<T>;
    export type Error<T extends HTMLElement = HTMLElement> = ErrorEvent & Base<T>;
    export type UI<T extends HTMLElement = HTMLElement> = UIEvent & Base<T>;
    export type Touch<T extends HTMLElement = HTMLElement> = TouchEvent & Base<T>;
    export type Animation<T extends HTMLElement = HTMLElement> = AnimationEvent & Base<T>;
    export type Transition<T extends HTMLElement = HTMLElement> = TransitionEvent & Base<T>;
}