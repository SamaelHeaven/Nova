export declare class Html {
    attribute(key: string, value: string): Html;
    attributes(attributes: [string, string][]): Html;
    attributeIf(condition: boolean, key: string, value: string): Html;
    class(value: string): Html;
    id(value: string): Html;
    style(value: string): Html;
    text(text: string): Html;
    on(event: keyof GlobalEventHandlersEventMap, callback: (event: Event) => void): Html;
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
