export class Html {
    constructor(tag) {
        this._attributes = [];
        this._children = [];
        this._events = [];
        this._tag = tag;
    }
    attribute(key, value) {
        this._attributes.push([key, value]);
        return this;
    }
    attributes(...attributes) {
        for (const [key, value] of attributes) {
            this._attributes.push([key, value]);
        }
        return this;
    }
    attributeIf(condition, key, value) {
        return this.if(condition, html => html.attribute(key, value));
    }
    attributesIf(condition, ...attributes) {
        return this.if(condition, html => html.attributes(...attributes));
    }
    class(value) {
        return this.attribute("class", value);
    }
    id(value) {
        return this.attribute("id", value);
    }
    on(event, callback) {
        this._events.push([event, callback]);
        return this;
    }
    if(condition, callback) {
        if (condition) {
            callback(this);
        }
        return this;
    }
    append(...children) {
        return this.appendArray(children);
    }
    appendArray(children) {
        for (const child of children) {
            if (child === this) {
                continue;
            }
            this._children.push(child);
        }
        return this;
    }
    appendIf(condition, callback) {
        if (!condition) {
            return this;
        }
        const value = callback();
        if (Array.isArray(value)) {
            return this.appendArray(value);
        }
        return this.append(value);
    }
    forRange(lower, upper, callback) {
        for (let i = lower; i < upper; i++) {
            callback(this, i);
        }
        return this;
    }
    appendForRange(lower, upper, callback) {
        return this.forRange(lower, upper, (_, index) => {
            const value = callback(index);
            if (Array.isArray(value)) {
                this.appendArray(value);
                return;
            }
            this.append(value);
        });
    }
    forEach(array, callback) {
        for (const element of array) {
            callback(this, element);
        }
        return this;
    }
    appendForEach(array, callback) {
        return this.forEach(array, (_, element) => {
            const value = callback(element);
            if (value instanceof Array) {
                this.appendArray(value);
                return;
            }
            this.append(value);
        });
    }
    build(fromElement) {
        const element = document.createElement(this._tag);
        const eventAttributeName = "data-event-uuid";
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
            element.setAttribute(eventAttributeName, "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)));
        }
        for (const [type, callback] of this._events) {
            const listener = (event) => {
                const target = event.target;
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
