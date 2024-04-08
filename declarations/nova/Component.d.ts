import { Events } from "./Events.js";
export declare abstract class Component {
    constructor(element: HTMLElement);
    render(): string | undefined;
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
