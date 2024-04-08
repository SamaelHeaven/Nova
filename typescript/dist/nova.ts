// @ts-nocheck

'use strict';

var DOCUMENT_FRAGMENT_NODE = 11;

function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
        return
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
        attr = toNodeAttrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;
        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
            if (fromValue !== attrValue) {
                if (attr.prefix === 'xmlns') {
                    attrName = attr.name;
                }
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue)
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);
            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue)
            }
        }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
        attr = fromNodeAttrs[d];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                fromNode.removeAttributeNS(attrNamespaceURI, attrName)
            }
        } else {
            if (!toNode.hasAttribute(attrName)) {
                fromNode.removeAttribute(attrName)
            }
        }
    }
}

var range;
var NS_XHTML = 'http://www.w3.org/1999/xhtml';
var doc = typeof document === 'undefined' ? undefined : document;
var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

function createFragmentFromTemplate(str) {
    var template = doc.createElement('template');
    template.innerHTML = str;
    return template.content.childNodes[0]
}

function createFragmentFromRange(str) {
    if (!range) {
        range = doc.createRange();
        range.selectNode(doc.body)
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0]
}

function createFragmentFromWrap(str) {
    var fragment = doc.createElement('body');
    fragment.innerHTML = str;
    return fragment.childNodes[0]
}

function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
        return createFragmentFromTemplate(str)
    } else if (HAS_RANGE_SUPPORT) {
        return createFragmentFromRange(str)
    }
    return createFragmentFromWrap(str)
}

function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
        return true
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
        return fromNodeName === toNodeName.toUpperCase()
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
        return toNodeName === fromNodeName.toUpperCase()
    } else {
        return false
    }
}

function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name)
}

function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild
    }
    return toEl
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '')
        } else {
            fromEl.removeAttribute(name)
        }
    }
}

var specialElHandlers = {
    OPTION: function (fromEl, toEl) {
        var parentNode = fromEl.parentNode;
        if (parentNode) {
            var parentName = parentNode.nodeName.toUpperCase();
            if (parentName === 'OPTGROUP') {
                parentNode = parentNode.parentNode;
                parentName = parentNode && parentNode.nodeName.toUpperCase()
            }
            if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
                if (fromEl.hasAttribute('selected') && !toEl.selected) {
                    fromEl.setAttribute('selected', 'selected');
                    fromEl.removeAttribute('selected')
                }
                parentNode.selectedIndex = -1
            }
        }
        syncBooleanAttrProp(fromEl, toEl, 'selected')
    }, INPUT: function (fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');
        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value
        }
        if (!toEl.hasAttribute('value')) {
            fromEl.removeAttribute('value')
        }
    }, TEXTAREA: function (fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue
        }
        var firstChild = fromEl.firstChild;
        if (firstChild) {
            var oldValue = firstChild.nodeValue;
            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return
            }
            firstChild.nodeValue = newValue
        }
    }, SELECT: function (fromEl, toEl) {
        if (!toEl.hasAttribute('multiple')) {
            var selectedIndex = -1;
            var i = 0;
            var curChild = fromEl.firstChild;
            var optgroup;
            var nodeName;
            while (curChild) {
                nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
                if (nodeName === 'OPTGROUP') {
                    optgroup = curChild;
                    curChild = optgroup.firstChild
                } else {
                    if (nodeName === 'OPTION') {
                        if (curChild.hasAttribute('selected')) {
                            selectedIndex = i;
                            break
                        }
                        i++
                    }
                    curChild = curChild.nextSibling;
                    if (!curChild && optgroup) {
                        curChild = optgroup.nextSibling;
                        optgroup = null
                    }
                }
            }
            fromEl.selectedIndex = selectedIndex
        }
    }
};
var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

function noop() {
}

function defaultGetNodeKey(node) {
    if (node) {
        return (node.getAttribute && node.getAttribute('id')) || node.id
    }
}

function morphdomFactory(morphAttrs) {
    return function morphdom(fromNode, toNode, options) {
        if (!options) {
            options = {}
        }
        if (typeof toNode === 'string') {
            if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML' || fromNode.nodeName === 'BODY') {
                var toNodeHtml = toNode;
                toNode = doc.createElement('html');
                toNode.innerHTML = toNodeHtml
            } else {
                toNode = toElement(toNode)
            }
        } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
            toNode = toNode.firstElementChild
        }
        var getNodeKey = options.getNodeKey || defaultGetNodeKey;
        var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
        var onNodeAdded = options.onNodeAdded || noop;
        var onBeforeElUpdated = options.onBeforeElUpdated || noop;
        var onElUpdated = options.onElUpdated || noop;
        var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
        var onNodeDiscarded = options.onNodeDiscarded || noop;
        var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
        var skipFromChildren = options.skipFromChildren || noop;
        var addChild = options.addChild || function (parent, child) {
            return parent.appendChild(child)
        };
        var childrenOnly = options.childrenOnly === true;
        var fromNodesLookup = Object.create(null);
        var keyedRemovalList = [];

        function addKeyedRemoval(key) {
            keyedRemovalList.push(key)
        }

        function walkDiscardedChildNodes(node, skipKeyedNodes) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = undefined;
                    if (skipKeyedNodes && (key = getNodeKey(curChild))) {
                        addKeyedRemoval(key)
                    } else {
                        onNodeDiscarded(curChild);
                        if (curChild.firstChild) {
                            walkDiscardedChildNodes(curChild, skipKeyedNodes)
                        }
                    }
                    curChild = curChild.nextSibling
                }
            }
        }

        function removeNode(node, parentNode, skipKeyedNodes) {
            if (onBeforeNodeDiscarded(node) === false) {
                return
            }
            if (parentNode) {
                parentNode.removeChild(node)
            }
            onNodeDiscarded(node);
            walkDiscardedChildNodes(node, skipKeyedNodes)
        }

        function indexTree(node) {
            if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = getNodeKey(curChild);
                    if (key) {
                        fromNodesLookup[key] = curChild
                    }
                    indexTree(curChild);
                    curChild = curChild.nextSibling
                }
            }
        }

        indexTree(fromNode);

        function handleNodeAdded(el) {
            onNodeAdded(el);
            var curChild = el.firstChild;
            while (curChild) {
                var nextSibling = curChild.nextSibling;
                var key = getNodeKey(curChild);
                if (key) {
                    var unmatchedFromEl = fromNodesLookup[key];
                    if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
                        curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
                        morphEl(unmatchedFromEl, curChild)
                    } else {
                        handleNodeAdded(curChild)
                    }
                } else {
                    handleNodeAdded(curChild)
                }
                curChild = nextSibling
            }
        }

        function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
            while (curFromNodeChild) {
                var fromNextSibling = curFromNodeChild.nextSibling;
                if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
                    addKeyedRemoval(curFromNodeKey)
                } else {
                    removeNode(curFromNodeChild, fromEl, true)
                }
                curFromNodeChild = fromNextSibling
            }
        }

        function morphEl(fromEl, toEl, childrenOnly) {
            var toElKey = getNodeKey(toEl);
            if (toElKey) {
                delete fromNodesLookup[toElKey]
            }
            if (!childrenOnly) {
                if (onBeforeElUpdated(fromEl, toEl) === false) {
                    return
                }
                morphAttrs(fromEl, toEl);
                onElUpdated(fromEl);
                if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                    return
                }
            }
            if (fromEl.nodeName !== 'TEXTAREA') {
                morphChildren(fromEl, toEl)
            } else {
                specialElHandlers.TEXTAREA(fromEl, toEl)
            }
        }

        function morphChildren(fromEl, toEl) {
            var skipFrom = skipFromChildren(fromEl, toEl);
            var curToNodeChild = toEl.firstChild;
            var curFromNodeChild = fromEl.firstChild;
            var curToNodeKey;
            var curFromNodeKey;
            var fromNextSibling;
            var toNextSibling;
            var matchingFromEl;
            outer:while (curToNodeChild) {
                toNextSibling = curToNodeChild.nextSibling;
                curToNodeKey = getNodeKey(curToNodeChild);
                while (!skipFrom && curFromNodeChild) {
                    fromNextSibling = curFromNodeChild.nextSibling;
                    if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer
                    }
                    curFromNodeKey = getNodeKey(curFromNodeChild);
                    var curFromNodeType = curFromNodeChild.nodeType;
                    var isCompatible = undefined;
                    if (curFromNodeType === curToNodeChild.nodeType) {
                        if (curFromNodeType === ELEMENT_NODE) {
                            if (curToNodeKey) {
                                if (curToNodeKey !== curFromNodeKey) {
                                    if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                                        if (fromNextSibling === matchingFromEl) {
                                            isCompatible = false
                                        } else {
                                            fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                                            if (curFromNodeKey) {
                                                addKeyedRemoval(curFromNodeKey)
                                            } else {
                                                removeNode(curFromNodeChild, fromEl, true)
                                            }
                                            curFromNodeChild = matchingFromEl;
                                            curFromNodeKey = getNodeKey(curFromNodeChild)
                                        }
                                    } else {
                                        isCompatible = false
                                    }
                                }
                            } else if (curFromNodeKey) {
                                isCompatible = false
                            }
                            isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                            if (isCompatible) {
                                morphEl(curFromNodeChild, curToNodeChild)
                            }
                        } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                            isCompatible = true;
                            if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                                curFromNodeChild.nodeValue = curToNodeChild.nodeValue
                            }
                        }
                    }
                    if (isCompatible) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer
                    }
                    if (curFromNodeKey) {
                        addKeyedRemoval(curFromNodeKey)
                    } else {
                        removeNode(curFromNodeChild, fromEl, true)
                    }
                    curFromNodeChild = fromNextSibling
                }
                if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
                    if (!skipFrom) {
                        addChild(fromEl, matchingFromEl)
                    }
                    morphEl(matchingFromEl, curToNodeChild)
                } else {
                    var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
                    if (onBeforeNodeAddedResult !== false) {
                        if (onBeforeNodeAddedResult) {
                            curToNodeChild = onBeforeNodeAddedResult
                        }
                        if (curToNodeChild.actualize) {
                            curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc)
                        }
                        addChild(fromEl, curToNodeChild);
                        handleNodeAdded(curToNodeChild)
                    }
                }
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling
            }
            ;cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
            var specialElHandler = specialElHandlers[fromEl.nodeName];
            if (specialElHandler) {
                specialElHandler(fromEl, toEl)
            }
        }

        var morphedNode = fromNode;
        var morphedNodeType = morphedNode.nodeType;
        var toNodeType = toNode.nodeType;
        if (!childrenOnly) {
            if (morphedNodeType === ELEMENT_NODE) {
                if (toNodeType === ELEMENT_NODE) {
                    if (!compareNodeNames(fromNode, toNode)) {
                        onNodeDiscarded(fromNode);
                        morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI))
                    }
                } else {
                    morphedNode = toNode
                }
            } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
                if (toNodeType === morphedNodeType) {
                    if (morphedNode.nodeValue !== toNode.nodeValue) {
                        morphedNode.nodeValue = toNode.nodeValue
                    }
                    return morphedNode
                } else {
                    morphedNode = toNode
                }
            }
        }
        if (morphedNode === toNode) {
            onNodeDiscarded(fromNode)
        } else {
            if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
                return
            }
            morphEl(morphedNode, toNode, childrenOnly);
            if (keyedRemovalList) {
                for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
                    var elToRemove = fromNodesLookup[keyedRemovalList[i]];
                    if (elToRemove) {
                        removeNode(elToRemove, elToRemove.parentNode, false)
                    }
                }
            }
        }
        if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
            if (morphedNode.actualize) {
                morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc)
            }
            fromNode.parentNode.replaceChild(morphedNode, fromNode)
        }
        return morphedNode
    }
}

var morphdom = morphdomFactory(morphAttrs);

export class Application {
    /** @internal */
    private static _instance: Application | null = null;
    /** @internal */
    private readonly _componentDefinitions: { name: string, class: (new (...args: any[]) => Component) }[];
    /** @internal */
    private readonly _morphdomOptions: object;
    /** @internal */
    private readonly _eventNames: string[];
    /** @internal */
    private _updating: boolean;

    private constructor() {
        this._componentDefinitions = [];
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromElement: { isEqualNode: (arg0: any) => any; }, toElement: any) {
                return !fromElement.isEqualNode(toElement);
            }
        };
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
    }

    public static launch(componentClasses: (new (...args: any[]) => Component)[]): void {
        if (Application._instance !== null) {
            throw new Error("Application has already been launched");
        }

        const app: Application = Application._getInstance();
        for (const componentClass of componentClasses) {
            app._componentDefinitions.push({
                name: Application._getComponentName(componentClass),
                class: componentClass
            });
        }

        app._updating = true;
        app._updateElement(document.documentElement);
        app._updating = false;
    }

    public static updateComponent(component: Component): void {
        Application._throwIfUninitialized();
        if ((component.element as any)?.component !== component) {
            return;
        }

        const app: Application = Application._getInstance();
        while (app._updating) {}
        app._updating = true;
        app._updateComponent(component);
        app._updating = false;
    }

    public static updateElement(element: HTMLElement): void {
        Application._throwIfUninitialized();
        const app: Application = Application._getInstance();
        while (app._updating) {}
        app._updating = true;
        const newElement: HTMLElement = element.cloneNode(true) as HTMLElement;
        app._updateElement(newElement);
        morphdom(element, newElement, app._morphdomOptions);
        app._updating = false;
    }

    public static getComponentById<T extends Component>(id: string): T | null {
        Application._throwIfUninitialized();
        return (document.getElementById(id) as any)?.component || null;
    }

    public static getComponentByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T | null {
        Application._throwIfUninitialized();
        const name: string = Application._getComponentName(clazz);
        const element: HTMLElement = document.querySelector(name);
        if (!element) {
            return null;
        }

        return (element as any)?.component || null;
    }

    public static getComponentsByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T[] {
        Application._throwIfUninitialized();
        const name: string = Application._getComponentName(clazz);
        const elements: HTMLElement[] = Array.from(document.querySelectorAll(name));
        const result: T[] = [];
        for (const element of elements) {
            if ((element as any)?.component) {
                result.push((element as any)?.component);
            }
        }

        return result;
    }

    /** @internal */
    private static _getInstance(): Application {
        return Application._instance ??= new Application();
    }

    /** @internal */
    private static _getComponentName<T extends Component>(clazz: (new (...args: any[]) => T)): string {
        const className: string = clazz.name;
        let result: string = '';
        for (let i = 0; i < className.length; i++) {
            if (i > 0 && className[i] === className[i].toUpperCase()) {
                result += '-';
            }
            result += className[i].toLowerCase();
        }

        return result;
    }

    /** @internal */
    private static _throwIfUninitialized(): void {
        if (Application._instance === null) {
            throw new Error("Application has not been launched");
        }
    }

    /** @internal */
    private _updateElement(root: HTMLElement): void {
        for (const componentDefinition of this._componentDefinitions) {
            for (const element of Array.from(root.getElementsByTagName(componentDefinition.name)) as HTMLElement[]) {
                if (!element.id || document.querySelectorAll(`#${element.id}`).length > 1) {
                    throw new Error("Components must have an unique id");
                }

                const existingElement: HTMLElement = document.getElementById(element.id);
                let component: Component;
                if (!existingElement || !(existingElement as any)?.component) {
                    component = new componentDefinition.class(element);
                    this._registerEventListeners(component);
                    (element as any).component = component;
                    component.onInit();
                } else {
                    component = (existingElement as any)?.component;
                }

                const renderedContent: string | null | undefined = component.render();
                if (!Validation.isNullOrUndefined(renderedContent)) {
                    element.innerHTML = renderedContent;
                }

                this._updateElement(element);
            }
        }
    }

    /** @internal */
    private _registerEventListeners(component: Component): void {
        for (const key of component.getKeys()) {
            const eventType: string = key.substring(2).toLowerCase();
            if (this._eventNames.includes(eventType)) {
                component.element.addEventListener(eventType, (event: Event): void => {
                    (component as any)[key](event);
                });
            }
        }
    }

    /** @internal */
    private _updateComponent(component: Component): void {
        const newElement: HTMLElement = component.element.cloneNode(false) as HTMLElement;
        const renderedContent: string | null | undefined = component.render();
        if (Validation.isNullOrUndefined(renderedContent)) {
            return;
        }

        newElement.innerHTML = component.render();
        this._updateElement(newElement);
        morphdom(component.element, newElement, this._morphdomOptions);
    }
}

export abstract class Component {
    /** @internal */
    private readonly _element: HTMLElement;

    constructor(element: HTMLElement) {
        this._element = element;
    }

    public render(): string | undefined {
        return undefined;
    }

    public get id(): string {
        return this._element.id;
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public getAttribute(name: string, defaultValue: string | null = null): string | null {
        const attribute: Attr = this._element.attributes.getNamedItem(name);
        if (attribute) {
            return attribute.value;
        }

        return defaultValue;
    }

    public update(state: object): void {
        for (const key of this.getKeys()) {
            if (this[key] === state) {
                this[key] = state;
            }
        }
    }

    public getKeys(): string[] {
        let keys: string[] = [];
        let currentPrototype = this;
        while (currentPrototype) {
            const parentPrototype = Object.getPrototypeOf(currentPrototype);
            if (parentPrototype && Object.getPrototypeOf(parentPrototype)) {
                keys = keys.concat(Object.getOwnPropertyNames(currentPrototype));
            }

            currentPrototype = parentPrototype;
        }

        return [...new Set(keys)];
    }

    public getComponentById<T extends Component>(id: string): T | null {
        return Application.getComponentById(id);
    }

    public getComponentByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T | null {
        return Application.getComponentByClass(clazz);
    }

    public getComponentsByClass<T extends Component>(clazz: (new (...args: any[]) => T)): T[] {
        return Application.getComponentsByClass(clazz);
    }

    public onInit(): void {}

    public onClick(event: Events.Mouse): void {}

    public onDblClick(event: Events.Mouse): void {}

    public onMouseDown(event: Events.Mouse): void {}

    public onMouseUp(event: Events.Mouse): void {}

    public onMouseMove(event: Events.Mouse): void {}

    public onMouseEnter(event: Events.Mouse): void {}

    public onMouseLeave(event: Events.Mouse): void {}

    public onMouseOver(event: Events.Mouse): void {}

    public onMouseOut(event: Events.Mouse): void {}

    public onKeyDown(event: Events.Keyboard): void {}

    public onKeyPress(event: Events.Keyboard): void {}

    public onKeyUp(event: Events.Keyboard): void {}

    public onFocus(event: Events.Focus): void {}

    public onBlur(event: Events.Focus): void {}

    public onInput(event: Events.Input): void {}

    public onChange(event: Events.BaseEvent): void {}

    public onSubmit(event: Events.BaseEvent): void {}

    public onScroll(event: Events.BaseEvent): void {}

    public onError(event: Events.Error): void {}

    public onResize(event: Events.UI): void {}

    public onSelect(event: Events.BaseEvent): void {}

    public onTouchStart(event: Events.Touch): void {}

    public onTouchMove(event: Events.Touch): void {}

    public onTouchEnd(event: Events.Touch): void {}

    public onTouchCancel(event: Events.Touch): void {}

    public onAnimationStart(event: Events.Animation): void {}

    public onAnimationEnd(event: Events.Animation): void {}

    public onAnimationIteration(event: Events.Animation): void {}

    public onTransitionStart(event: Events.Transition): void {}

    public onTransitionEnd(event: Events.Transition): void {}

    public onTransitionCancel(event: Events.Transition): void {}
}

export class Debounce {
    /** @internal */
    private readonly _callback: (...args: any[]) => void;
    /** @internal */
    private _timeoutId: number | null;

    constructor(callback: Function, wait: number) {
        this._timeoutId = null;
        this._callback = (...args: any[]): void => {
            window.clearTimeout(this._timeoutId);
            this._timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    }

    public call(...args: any[]): void {
        this._callback.apply(this, args);
    }
}

export namespace Events {
    export type BaseEvent = Event & { target: HTMLElement, currentTarget: HTMLElement, relatedTarget: HTMLElement }
    export type Mouse = MouseEvent & BaseEvent;
    export type Keyboard = KeyboardEvent & BaseEvent;
    export type Focus = FocusEvent & BaseEvent;
    export type Input = InputEvent & BaseEvent;
    export type Error = ErrorEvent & BaseEvent;
    export type UI = UIEvent & BaseEvent;
    export type Touch = TouchEvent & BaseEvent;
    export type Animation = AnimationEvent & BaseEvent;
    export type Transition = TransitionEvent & BaseEvent;
}

export namespace Format {
    export function date(arg: Date | undefined | null | number | string | "today" | "tomorrow" | "yesterday", format: string): string {
        let date: Date;
        if (arg instanceof Date) {
            date = arg;
        } else if (arg === "today" || Validation.isNumber(arg) || Validation.isNullOrUndefinedOrEmpty(arg as string)) {
            date = new Date();
        } else if (arg === "tomorrow") {
            date = new Date();
            date.setDate(date.getDate() + 1);
        } else if (arg === "yesterday") {
            date = new Date();
            date.setDate(date.getDate() - 1);
        } else {
            date = new Date(arg);
        }

        const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        return format.replace(/(d{1,4}|m{1,4}|y{2,4}|h{1,2}|H{1,2}|M{1,2}|s{1,2}|l|L|t{1,2}|T{1,2}'[^']*'|"[^"]*")/g, function (match: string): string {
            switch (match) {
                case "d":
                    return date.getDate().toString();
                case "dd":
                    return date.getDate().toString().padStart(2, "0");
                case "ddd":
                    return dayNames[date.getDay()].slice(0, 3);
                case "dddd":
                    return dayNames[date.getDay()];
                case "m":
                    return (date.getMonth() + 1).toString();
                case "mm":
                    return String(date.getMonth() + 1).padStart(2, "0");
                case "mmm":
                    return monthNames[date.getMonth()].slice(0, 3);
                case "mmmm":
                    return monthNames[date.getMonth()];
                case "yy":
                    return String(date.getFullYear()).slice(-2);
                case "yyyy":
                    return date.getFullYear().toString();
                case "h":
                    return (date.getHours() % 12 || 12).toString();
                case "hh":
                    return String(date.getHours() % 12 || 12).padStart(2, "0");
                case "H":
                    return date.getHours().toString();
                case "HH":
                    return String(date.getHours()).padStart(2, "0");
                case "M":
                    return date.getMinutes().toString();
                case "MM":
                    return String(date.getMinutes()).padStart(2, "0");
                case "s":
                    return date.getSeconds().toString();
                case "ss":
                    return String(date.getSeconds()).padStart(2, "0");
                case "l":
                    return String(date.getMilliseconds()).padStart(3, "0");
                case "L":
                    return String(date.getMilliseconds()).padStart(3, "0").substring(0, 2);
                case "t":
                    return date.getHours() < 12 ? "a" : "p";
                case "tt":
                    return date.getHours() < 12 ? "am" : "pm";
                case "T":
                    return date.getHours() < 12 ? "A" : "P";
                case "TT":
                    return date.getHours() < 12 ? "AM" : "PM";
                default:
                    return match.slice(1, -1);
            }
        });
    }

    export function titleCase(arg: any): string {
        const str: string = String(arg).trim();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    export function upperCase(arg: any): string {
        const str: string = String(arg).trim();
        return str.toUpperCase();
    }

    export function lowerCase(arg: any): string {
        const str: string = String(arg).trim();
        return str.toLowerCase();
    }

    export function percentage(arg: any, digits: number): string {
        const value: number = Number(arg);
        return (value).toFixed(digits) + "%";
    }

    export function decimal(arg: any, digits: number): string {
        const value: number = Number(arg);
        return value.toFixed(digits);
    }

    export function currency(amount: number, currency: string = "USD"): string {
        return amount.toLocaleString(undefined, {
            style: 'currency',
            currency: currency
        });
    }
}

type Item<T> = {
    value: T;
    expiry: number | undefined;
};

export namespace LocalStorage {
    export function getItem<T>(key: string): T | null {
        const itemString: string = localStorage.getItem(key);
        if (!itemString) {
            return null;
        }

        const item: Item<T> = JSON.parse(itemString);
        if (item.expiry !== undefined && item.expiry < new Date().getTime()) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    }

    export function setItem<T>(key: string, value: T, ttl: number | undefined = undefined): void {
        const item: Item<T> = {
            value,
            expiry: ttl !== undefined ? new Date().getTime() + ttl : undefined
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
}

export function State(target: any, key: string): void {
    let value = target[key];

    const getter = function () {
        return value;
    };

    const setter = function (newValue: any): void {
        value = newValue;
        if (this instanceof Component) {
            Application.updateComponent(this);
        }
    };

    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}

export namespace Validation {
    export function isEmail(email: string): boolean {
        return !!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    export function isPhoneNumber(phoneNumber: string): boolean {
        return !!phoneNumber.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
    }

    export function isDateEquals(date: Date, expected: Date): boolean {
        return date.getTime() === expected.getTime();
    }

    export function isDateAfter(date: Date, minDate: Date): boolean {
        return date.getTime() > minDate.getTime();
    }

    export function isDateBefore(date: Date, maxDate: Date): boolean {
        return date.getTime() < maxDate.getTime();
    }

    export function isDateBetween(date: Date, minDate: Date, maxDate: Date): boolean {
        return date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime();
    }

    export function isPositiveInteger(value: string): boolean {
        return !!value.match(/^\d+$/);
    }

    export function isNegativeInteger(value: string): boolean {
        return !!value.match(/^-\d+$/);
    }

    export function isInteger(value: string): boolean {
        return !!value.match(/^(-?\d+)$/);
    }

    export function isPositiveNumeric(value: string): boolean {
        return !!value.match(/^\d+(\.\d+)?$/);
    }

    export function isNegativeNumeric(value: string): boolean {
        return !!value.match(/^-\d+(\.\d+)?$/);
    }

    export function isNumeric(value: string): boolean {
        return !!value.match(/^(-?\d+(\.\d+)?)$/);
    }

    export function isInRange(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }

    export function isString(value: any): boolean {
        return typeof value === "string";
    }

    export function isNumber(value: any): boolean {
        return typeof value === "number";
    }

    export function isBoolean(value: any): boolean {
        return typeof value === "boolean";
    }

    export function isArray(value: any): boolean {
        return Array.isArray(value);
    }

    export function isJson(value: string): boolean {
        try {
            JSON.parse(value);
            return true;
        } catch (_) {
            return false;
        }
    }

    export function isFiniteNumber(value: any): boolean {
        return typeof value === "number" && isFinite(value);
    }

    export function isNan(value: number): boolean {
        return isNaN(value);
    }

    export function isInfinity(value: number): boolean {
        return value === Infinity || value === -Infinity;
    }

    export function isRegex(value: string, regex: RegExp): boolean {
        return regex.test(value);
    }

    export function isEmpty(value: { length: number }): boolean {
        return value.length === 0;
    }

    export function isNull(value: any): boolean {
        return value === null;
    }

    export function isUndefined(value: any): boolean {
        return value === undefined;
    }

    export function isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

    export function isNullOrUndefinedOrEmpty(value: null | undefined | { length: number }): boolean {
        return value === null || value === undefined || value.length <= 0;
    }
}