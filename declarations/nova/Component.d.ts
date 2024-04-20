import { Events } from "./Events.js";
import { ComponentDefinition } from "./ComponentDefinition.js";
export declare abstract class Component {
    readonly uuid: string;
    readonly element: HTMLElement;
    readonly initialized: boolean;
    readonly appeared: boolean;
    readonly keys: ReadonlyArray<string>;
    readonly subscribers: [Component | (() => void), keyof this & string][];
    shouldUpdate: boolean;
    constructor(element: HTMLElement);
    static define(tag: string): ComponentDefinition;
    render(): string;
    update(before?: () => void | Promise<void>): void;
    on(event: keyof GlobalEventHandlersEventMap, call: keyof this & string): string;
    bind(key: keyof this & string): string;
    queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
    closestComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    onInit(): void | Promise<void>;
    onAppear(): void;
    onUpdate(): void;
    onDestroy(): void;
    onMorph(toElement: HTMLElement): void | boolean;
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
    onChange(event: Events.Base): any;
    onSubmit(event: Events.Base): any;
    onScroll(event: Events.Base): any;
    onError(event: Events.Error): any;
    onResize(event: Events.UI): any;
    onSelect(event: Events.Base): any;
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
