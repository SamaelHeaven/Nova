export namespace Events {
    export type BaseEvent = Event & { target: HTMLElement, currentTarget: HTMLElement, relatedTarget: HTMLElement }
    export type Mouse = MouseEvent & BaseEvent;
    export type Keyboard = KeyboardEvent & BaseEvent;
    export type Focus = FocusEvent & BaseEvent;
    export type Input = InputEvent & BaseEvent;
    export type Error = ErrorEvent & BaseEvent;
    export type UI = UIEvent & BaseEvent;
    export type Touch = TouchEvent & BaseEvent;
    export type Animation = AnimationEvent & BaseEvent;
    export type Transition = TransitionEvent & BaseEvent;
}