export class Html {
    constructor(tag) {
        this._attributes = [];
        this._children = [];
        this._events = [];
        this._text = "";
        this._tag = tag;
    }
    attribute(key, value) {
        this._attributes.push([key, value]);
        return this;
    }
    attributes(attributes) {
        for (const attribute of attributes) {
            this._attributes.push(attribute);
        }
        return this;
    }
    attributeIf(condition, key, value) {
        return this.if(condition, html => html.attribute(key, value));
    }
    class(value) {
        this.attribute("class", value);
        return this;
    }
    id(value) {
        this.attribute("id", value);
        return this;
    }
    style(value) {
        this.attribute("style", value);
        return this;
    }
    text(text) {
        this._text = text;
        return this;
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
    ifElse(condition, onTrue, onFalse) {
        if (condition) {
            onTrue(this);
            return this;
        }
        onFalse(this);
        return this;
    }
    append(child) {
        if (child === this) {
            return;
        }
        this._children.push(child);
        return this;
    }
    appendAll(children) {
        for (const child of children) {
            this.append(child);
        }
        return this;
    }
    appendIf(condition, callback) {
        return this.if(condition, (html) => html.append(callback()));
    }
    appendAllIf(condition, callback) {
        return this.if(condition, (html) => html.appendAll(callback()));
    }
    appendIfElse(condition, onTrue, onFalse) {
        return this.ifElse(condition, (html) => html.append(onTrue()), (html) => html.append(onFalse()));
    }
    appendAllIfElse(condition, onTrue, onFalse) {
        return this.ifElse(condition, (html) => html.appendAll(onTrue()), (html) => html.appendAll(onFalse()));
    }
    forRange(lower, upper, callback) {
        for (let i = lower; i < upper; i++) {
            callback(this, i);
        }
        return this;
    }
    appendForRange(lower, upper, callback) {
        return this.forRange(lower, upper, (html, index) => html.append(callback(index)));
    }
    forEach(array, callback) {
        for (const element of array) {
            callback(this, element);
        }
        return this;
    }
    appendForEach(array, callback) {
        return this.forEach(array, (html, element) => html.append(callback(element)));
    }
    build(fromElement) {
        const element = document.createElement(this._tag);
        const eventAttributeName = "app-component-event";
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
