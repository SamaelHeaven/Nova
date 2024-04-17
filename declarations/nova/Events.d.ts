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
