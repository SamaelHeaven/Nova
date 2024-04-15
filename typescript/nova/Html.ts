export class Html {
    /** @internal */
    private readonly _tag: string;
    /** @internal */
    private readonly _attributes: [string, string][] = [];
    /** @internal */
    private readonly _children: (Html | string)[] = [];
    /** @internal */
    private readonly _events: [keyof GlobalEventHandlersEventMap | string, (event: Event) => any][] = [];

    /** @internal */
    constructor(tag: string) {
        this._tag = tag;
    }

    public attribute(key: string, value: string): Html {
        this._attributes.push([key, value]);
        return this;
    }

    public attributes(...attributes: [string, string][]): Html {
        for (const [key, value] of attributes) {
            this._attributes.push([key, value]);
        }

        return this;
    }

    public attributeIf(condition: boolean, key: string, value: string): Html {
        return this.if(condition, html => html.attribute(key, value));
    }

    public attributesIf(condition: boolean, ...attributes: [string, string][]): Html {
        return this.if(condition, html => html.attributes(...attributes));
    }

    public class(value: string): Html {
        return this.attribute("class", value);
    }

    public id(value: string): Html {
        return this.attribute("id", value);
    }

    public on(event: keyof GlobalEventHandlersEventMap | string, callback: (event: Event) => any): Html {
        this._events.push([event, callback]);
        return this;
    }

    public if(condition: boolean, callback: (html: Html) => void): Html {
        if (condition) {
            callback(this);
        }

        return this;
    }

    public append(...children: (Html | string)[]): Html {
        return this.appendArray(children);
    }

    public appendArray(children: (Html | string)[]): Html {
        for (const child of children) {
            if (child === this) {
                continue;
            }

            this._children.push(child);
        }

        return this;
    }

    public appendIf(condition: boolean, callback: (() => (Html | string) | (Html | string)[])): Html {
        if (!condition) {
            return this;
        }

        const value = callback();
        if (Array.isArray(value)) {
            return this.appendArray(value);
        }

        return this.append(value);
    }

    public forRange(lower: number, upper: number, callback: (html: Html, index: number) => void): Html {
        for (let i = lower; i < upper; i++) {
            callback(this, i);
        }

        return this;
    }

    public appendForRange(lower: number, upper: number, callback: (index: number) => (Html | string) | (Html | string)[]): Html {
        return this.forRange(lower, upper, (_, index) => {
            const value = callback(index);
            if (Array.isArray(value)) {
                this.appendArray(value);
                return;
            }

            this.append(value);
        });
    }

    public forEach<T>(array: T[], callback: (html: Html, element: T) => void): Html {
        for (const element of array) {
            callback(this, element);
        }

        return this;
    }

    public appendForEach<T>(array: T[], callback: (element: T) => (Html | string) | (Html | string)[]): Html {
        return this.forEach(array, (_, element) => {
            const value = callback(element);
            if (value instanceof Array) {
                this.appendArray(value);
                return;
            }

            this.append(value);
        });
    }

    /** @internal */
    public build(fromElement: HTMLElement): HTMLElement {
        const element: HTMLElement = document.createElement(this._tag);
        const eventAttributeName: string = "data-event-uuid";

        for (const [key, value] of this._attributes) {
            element.setAttribute(key, value);
        }

        for (const child of this._children) {
            if (child instanceof Html) {
                element.appendChild(child.build(fromElement));
                continue;
            }

            element.appendChild(document.createTextNode(child));
        }

        if (this._events.length > 0) {
            element.setAttribute(eventAttributeName, "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
            ));
        }

        for (const [type, callback] of this._events) {
            const listener = (event: Event): any => {
                const target: HTMLElement = (event.target as HTMLElement);
                if (target.closest(`[${eventAttributeName}="${element.getAttribute(eventAttributeName)}"]`)) {
                    return callback(event);
                }
            };

            fromElement.addEventListener(type, listener);
            if (!fromElement.appComponentEvents) {
                fromElement.appComponentEvents = [];
            }

            fromElement.appComponentEvents.push([type, listener]);
        }

        return element;
    }
}