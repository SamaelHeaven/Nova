export declare class Html {
    attribute(key: string, value: string): Html;
    attributes(...attributes: [string, string][]): Html;
    attributeIf(condition: boolean, key: string, value: string): Html;
    attributesIf(condition: boolean, ...attributes: [string, string][]): Html;
    class(value: string): Html;
    id(value: string): Html;
    on(event: keyof GlobalEventHandlersEventMap | string, callback: (event: Event) => any): Html;
    if(condition: boolean, callback: (html: Html) => void): Html;
    append(...children: (Html | string)[]): Html;
    appendArray(children: (Html | string)[]): Html;
    appendIf(condition: boolean, callback: (() => (Html | string) | (Html | string)[])): Html;
    forRange(lower: number, upper: number, callback: (html: Html, index: number) => void): Html;
    appendForRange(lower: number, upper: number, callback: (index: number) => (Html | string) | (Html | string)[]): Html;
    forEach<T>(array: T[], callback: (html: Html, element: T) => void): Html;
    appendForEach<T>(array: T[], callback: (element: T) => (Html | string) | (Html | string)[]): Html;
}
