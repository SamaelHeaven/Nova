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
