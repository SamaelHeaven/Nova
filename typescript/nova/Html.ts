export class Html {
    /** @internal */
    private readonly _tag: string;
    /** @internal */
    private readonly _attributes: [string, string][] = [];
    /** @internal */
    private readonly _children: Html[] = [];
    /** @internal */
    private readonly _events: [keyof GlobalEventHandlersEventMap, (event: Event) => void][] = [];
    /** @internal */
    private _text: string = "";

    /** @internal */
    constructor(tag: string) {
        this._tag = tag;
    }

    public attribute(key: string, value: string): Html {
        this._attributes.push([key, value]);
        return this;
    }

    public attributes(attributes: [string, string][]): Html {
        for (const attribute of attributes) {
            this._attributes.push(attribute);
        }

        return this;
    }

    public attributeIf(condition: boolean, key: string, value: string): Html {
        return this.if(condition, html => html.attribute(key, value));
    }

    public class(value: string): Html {
        this.attribute("class", value);
        return this;
    }

    public id(value: string): Html {
        this.attribute("id", value);
        return this;
    }

    public style(value: string): Html {
        this.attribute("style", value);
        return this;
    }

    public text(text: string): Html {
        this._text = text;
        return this;
    }

    public on(event: keyof GlobalEventHandlersEventMap, callback: (event: Event) => void): Html {
        this._events.push([event, callback]);
        return this;
    }

    public if(condition: boolean, callback: (html: Html) => void): Html {
        if (condition) {
            callback(this);
        }

        return this;
    }

    public ifElse(condition: boolean, onTrue: (html: Html) => void, onFalse: (html: Html) => void): Html {
        if (condition) {
            onTrue(this);
            return this;
        }

        onFalse(this);
        return this;
    }

    public append(child: Html): Html {
        if (child === this) {
            return;
        }

        this._children.push(child);
        return this;
    }

    public appendAll(children: Html[]): Html {
        for (const child of children) {
            this.append(child);
        }

        return this;
    }

    public appendIf(condition: boolean, callback: () => Html): Html {
        return this.if(condition, (html) => html.append(callback()));
    }

    public appendAllIf(condition: boolean, callback: () => Html[]): Html {
        return this.if(condition, (html) => html.appendAll(callback()));
    }

    public appendIfElse(condition: boolean, onTrue: () => Html, onFalse: () => Html): Html {
        return this.ifElse(condition, (html) => html.append(onTrue()), (html) => html.append(onFalse()));
    }

    public appendAllIfElse(condition: boolean, onTrue: () => Html[], onFalse: () => Html[]): Html {
        return this.ifElse(condition, (html) => html.appendAll(onTrue()), (html) => html.appendAll(onFalse()));
    }

    public forRange(lower: number, upper: number, callback: (html: Html, index: number) => void): Html {
        for (let i = lower; i < upper; i++) {
            callback(this, i);
        }

        return this;
    }

    public appendForRange(lower: number, upper: number, callback: (index: number) => Html): Html {
        return this.forRange(lower, upper, (html, index) => html.append(callback(index)));
    }

    public forEach<T>(array: T[], callback: (html: Html, element: T) => void): Html {
        for (const element of array) {
            callback(this, element);
        }

        return this;
    }

    public appendForEach<T>(array: T[], callback: (element: T) => Html): Html {
        return this.forEach(array, (html, element) => html.append(callback(element)));
    }

    /** @internal */
    public build(fromElement: HTMLElement): HTMLElement {
        const element: HTMLElement = document.createElement(this._tag);

        for (const [key, value] of this._attributes) {
            element.setAttribute(key, value);
        }

        if (this._text) {
            element.innerText = this._text;
        }

        for (const child of this._children) {
            element.appendChild(child.build(fromElement));
        }

        if (this._events.length > 0) {
            element.setAttribute("event", "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
            ));
        }

        for (const key of Object.keys(HTMLElement.prototype)) {
            if (!key.startsWith("on")) {
                continue;
            }

            const event = fromElement[key];
            const events = this._events.filter(e => "on" + e[0] === key);
            if (events.length === 0) {
                continue;
            }

            fromElement[key] = (e: Event) => {
                if (event) {
                    event(e);
                }

                let currentElement = (e.target as HTMLElement);
                while (currentElement && currentElement !== fromElement) {
                    if (currentElement.getAttribute("event") === element.getAttribute("event")) {
                        for (const event of events) {
                            event[1](e);
                        }

                        break;
                    }

                    currentElement = currentElement.parentElement;
                }
            }
        }

        return element;
    }
}