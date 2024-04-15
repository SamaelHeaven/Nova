declare global {
    interface String {
        html(): Html;
    }
    interface Date {
        format(format: string): string;
    }
}
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
    render(): Html;
    onInit(): void | Promise<void>;
    onAppear(): void;
    onUpdate(): void;
    onDestroy(): void;
    onMorph(toElement: HTMLElement): void;
    onAttributeChanged(attribute: string, oldValue: string, newValue: string): void;
    update(state: object): void;
    queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null;
    queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[];
    getKeys(): string[];
}
export type ComponentConstructor = (new (element: HTMLElement) => Component);
export type ComponentDefinition = {
    tag: string;
    ctor: ComponentConstructor;
};
export declare class Debounce {
    constructor(callback: Function, wait: number);
    call(...args: any[]): void;
}
export declare class Html {
    attribute(key: string, value: string): Html;
    attributes(attributes: [string, string][]): Html;
    attributeIf(condition: boolean, key: string, value: string): Html;
    class(value: string): Html;
    id(value: string): Html;
    style(value: string): Html;
    text(text: string): Html;
    on(event: keyof GlobalEventHandlersEventMap | string, callback: (event: Event) => any): Html;
    if(condition: boolean, callback: (html: Html) => void): Html;
    ifElse(condition: boolean, onTrue: (html: Html) => void, onFalse: (html: Html) => void): Html;
    append(child: Html): Html;
    appendAll(children: Html[]): Html;
    appendIf(condition: boolean, callback: () => Html): Html;
    appendAllIf(condition: boolean, callback: () => Html[]): Html;
    appendIfElse(condition: boolean, onTrue: () => Html, onFalse: () => Html): Html;
    appendAllIfElse(condition: boolean, onTrue: () => Html[], onFalse: () => Html[]): Html;
    forRange(lower: number, upper: number, callback: (html: Html, index: number) => void): Html;
    appendForRange(lower: number, upper: number, callback: (index: number) => Html): Html;
    forEach<T>(array: T[], callback: (html: Html, element: T) => void): Html;
    appendForEach<T>(array: T[], callback: (element: T) => Html): Html;
}
export declare namespace LocalStorage {
    function getItem<T>(key: string): T | null;
    function setItem<T>(key: string, value: T, ttl?: number | undefined): void;
}
export declare function State(target: Component, key: string): void;
