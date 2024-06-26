// @ts-nocheck

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

function noop() {}

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

declare global {
    interface Date {
        format(format: string): string;
    }

    interface HTMLElement {
        appComponent?: { instance: Component, dirty: boolean };
    }
}

Date.prototype.format = formatDate;

export class Application {
    /** @internal */
    private static _instance: Application | null = null;
    /** @internal */
    private readonly _eventNames: string[];
    /** @internal */
    private readonly _morphdomOptions: object;

    private constructor() {
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
        this._morphdomOptions = {
            onBeforeElUpdated: (fromEl: HTMLElement, toEl: HTMLElement): boolean => this._onBeforeElementUpdated(fromEl, toEl)
        };
    }

    public static launch(componentDefinitions: ComponentDefinition[]): void {
        if (this._instance !== null) {
            throw new Error("Application has already been launched");
        }

        const app: Application = this._getInstance();
        app._initializeComponents([...new Set(componentDefinitions)]);
        app._initializeEvents();
    }

    public static updateComponent(component: Component): void {
        this._throwIfUninitialized();
        if (component.shouldUpdate) {
            this._getInstance()._updateComponent(component);
        }
    }

    public static queryComponent<T extends Component>(selector: string, element: HTMLElement = document.documentElement): T | null {
        this._throwIfUninitialized();
        return (element.querySelector(selector) as HTMLElement)?.appComponent?.instance as T || null;
    }

    public static queryComponents<T extends Component>(selector: string, element: HTMLElement = document.documentElement): T[] {
        this._throwIfUninitialized();
        const components: T[] = [];
        for (const foundElement of Array.from(element.querySelectorAll(selector))) {
            const component: Component | undefined = (foundElement as HTMLElement).appComponent?.instance;
            if (component) {
                components.push(component as T);
            }
        }

        return components;
    }

    public static closestComponent<T extends Component>(selector: string, element: HTMLElement): T | null {
        this._throwIfUninitialized();
        const foundElement: HTMLElement = element.closest(selector);
        if (!foundElement) {
            return null;
        }

        const component: Component | undefined = foundElement.appComponent?.instance;
        if (component) {
            return component as T;
        }

        return this.closestComponent(selector, foundElement.parentElement);
    }

    /** @internal */
    private static _getInstance(): Application {
        return this._instance ??= new Application();
    }

    /** @internal */
    private static _throwIfUninitialized(): void {
        if (this._instance === null) {
            throw new Error("Application has not been launched");
        }
    }

    /** @internal */
    private registerComponentEvents(component: Component): void {
        for (const key of component.keys) {
            const eventType: string = key.substring(2).toLowerCase();
            if (this._eventNames.includes(eventType)) {
                component.element.addEventListener(eventType, (event: Event): any => {
                    return component[key](event);
                });
            }
        }
    }

    /** @internal */
    private _updateComponent(component: Component): void {
        if (!component.initialized || !component.keys.includes("render")) {
            return;
        }

        const newElement: HTMLElement = component.element.cloneNode(false) as HTMLElement;
        morphdom(component.element, newElement, this._morphdomOptions);
        for (const element of Array.from(component.element.parentElement.querySelectorAll("*")) as HTMLElement[]) {
            const appComponent: { instance: Component, dirty: boolean } | undefined = element.appComponent;
            if (appComponent && appComponent.dirty) {
                appComponent.dirty = false;
                this._onElementUpdated(element);
            }
        }
    }

    /** @internal */
    private _onBeforeElementUpdated(fromElement: HTMLElement, toElement: HTMLElement): boolean {
        const component: Component | undefined = fromElement.appComponent?.instance;
        if (component && component.initialized && component.keys.includes("render")) {
            toElement.innerHTML = component.shouldUpdate ? component.render() : fromElement.innerHTML;
            toElement.style.display = "contents";
            toElement.setAttribute("data-uuid", component.uuid);
            if (component.shouldUpdate) {
                const morphResult: void | boolean = component.onMorph(toElement);
                fromElement.appComponent.dirty = true;
                if (morphResult === false) {
                    return false;
                }
            }
        }

        return !fromElement.isEqualNode(toElement);
    }

    /** @internal */
    private _onElementUpdated(element: HTMLElement): void {
        const component: Component | undefined = element.appComponent?.instance;
        if (component && component.appeared) {
            component.onUpdate();
        }
    }

    /** @internal */
    private _initializeComponents(componentDefinitions: ComponentDefinition[]): void {
        for (const component of componentDefinitions) {
            this._initializeComponent(component);
        }
    }

    /** @internal */
    private _initializeComponent(componentDefinition: ComponentDefinition): void {
        const app = this;

        class ComponentElement extends HTMLElement {
            public connectedCallback(): void {
                this.style.display = "contents";
                this.appComponent = {instance: new componentDefinition.ctor(this), dirty: false};
                this.setAttribute("data-uuid", this.appComponent.instance.uuid);
                const initResult: void | Promise<void> = this.appComponent.instance.onInit();
                if (initResult instanceof Promise) {
                    initResult.then(() => app._initializeElement(this));
                    return;
                }

                app._initializeElement(this);
            }

            public disconnectedCallback(): void {
                this.appComponent.instance.onDestroy();
            }
        }

        customElements.define(componentDefinition.tag, ComponentElement);
    }

    /** @internal */
    private _initializeElement(element: HTMLElement): void {
        const component: Component = element.appComponent.instance;
        (component as any).initialized = true;
        this._observeAttributes(component);
        this.registerComponentEvents(component);
        this._updateComponent(component);
        component.onAppear();
        (component as any).appeared = true;
    }

    /** @internal */
    private _initializeEvents(): void {
        for (const eventName of this._eventNames) {
            document.documentElement.addEventListener(eventName, (event: Event) => this._onEvent(event, event.target as HTMLElement));
        }
    }

    /** @internal */
    private _onEvent(event: Event, element: HTMLElement): void {
        this._handleEvent(event, element);
        this._handleBind(event);
    }

    /** @internal */
    private _handleEvent(event: Event, element: HTMLElement): void {
        const eventElement: HTMLElement = element.closest(`[data-on-${event.type}]`);
        if (!eventElement) {
            return;
        }

        const [uuid, call] = eventElement.getAttribute(`data-on-${event.type}`).split(";");
        const component: Component = (eventElement.closest(`[data-uuid="${uuid}"]`) as HTMLElement).appComponent.instance;
        if (component[call](event) !== false) {
            this._handleEvent(event, eventElement.parentElement);
        }
    }

    /** @internal */
    private _handleBind(event: Event): void {
        if (event.type !== "input") {
            return;
        }

        const bindElement: HTMLInputElement = event.target as HTMLInputElement;
        const binding: string | null = bindElement.getAttribute("data-bind");
        if (!binding) {
            return;
        }

        const [uuid, key] = binding.split(";");
        let value: string | undefined | null = bindElement.value;
        if (value === undefined || value === null) {
            value = bindElement.getAttribute("value");
        }

        if (value !== undefined && value !== null) {
            const component: Component = (bindElement.closest(`[data-uuid="${uuid}"]`) as HTMLElement).appComponent.instance;
            component[key] = value;
        }
    }

    /** @internal */
    private _observeAttributes(component: Component): void {
        if (!component.keys.includes("onAttributeChanged")) {
            return;
        }

        const observerConfig: MutationObserverInit = {attributes: true, attributeOldValue: true, subtree: false};
        const observer: MutationObserver = new MutationObserver((mutationsList: MutationRecord[], _: MutationObserver): void => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    component.onAttributeChanged(mutation.attributeName, mutation.oldValue, component.element.getAttribute(mutation.attributeName))
                }
            }
        });

        observer.observe(component.element, observerConfig);
    }
}

export abstract class Component {
    public readonly uuid: string;
    public readonly element: HTMLElement;
    public readonly initialized: boolean;
    public readonly appeared: boolean;
    public readonly keys: ReadonlyArray<string>;
    public readonly subscribers: [Component | (() => void), keyof this & string][];
    public shouldUpdate: boolean;

    constructor(element: HTMLElement) {
        this.uuid = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (value: string) =>
            (+value ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +value / 4).toString(16)
        );

        this.element = element;
        this.initialized = false;
        this.appeared = false;
        this.subscribers = [];
        this.shouldUpdate = true;
        let keys: string[] = [];
        let currentPrototype = this;
        while (currentPrototype) {
            const parentPrototype = Object.getPrototypeOf(currentPrototype);
            if (parentPrototype && Object.getPrototypeOf(parentPrototype)) {
                keys = keys.concat(Object.getOwnPropertyNames(currentPrototype));
            }

            currentPrototype = parentPrototype;
        }

        this.keys = [...new Set(keys)];
    }

    static define(tag: string): ComponentDefinition {
        return {tag, ctor: this as unknown as ComponentConstructor};
    }

    public render(): string {
        return "";
    }

    public update(before?: () => void | Promise<void>): void {
        if (before) {
            const shouldUpdate: boolean = this.shouldUpdate;
            this.shouldUpdate = false;
            const beforeResult: void | Promise<void> = before();
            if (beforeResult instanceof Promise) {
                beforeResult.then((): void => {
                    this.shouldUpdate = shouldUpdate;
                    Application.updateComponent(this);
                });
                return;
            } else {
                this.shouldUpdate = shouldUpdate;
            }
        }

        Application.updateComponent(this);
    }

    public on(event: keyof GlobalEventHandlersEventMap, call: keyof this & string): string {
        return `data-on-${event}="${this.uuid};${call as string}"`;
    }

    public bind(key: keyof this & string): string {
        return `data-bind="${this.uuid};${key}"`;
    }

    public queryComponent<T extends Component>(selector: string, element?: HTMLElement): T | null {
        return Application.queryComponent<T>(selector, element);
    }

    public queryComponents<T extends Component>(selector: string, element?: HTMLElement): T[] {
        return Application.queryComponents<T>(selector, element);
    }

    public closestComponent<T extends Component>(selector: string, element: HTMLElement = this.element): T | null {
        return Application.closestComponent<T>(selector, element);
    }

    public onInit(): void | Promise<void> {}

    public onAppear(): void {}

    public onUpdate(): void {}

    public onDestroy(): void {}

    public onMorph(toElement: HTMLElement): void | boolean {}

    public onAttributeChanged(attribute: string, oldValue: string, newValue: string): void {}

    public onClick(event: Events.Mouse): any {}

    public onDblClick(event: Events.Mouse): any {}

    public onMouseDown(event: Events.Mouse): any {}

    public onMouseUp(event: Events.Mouse): any {}

    public onMouseMove(event: Events.Mouse): any {}

    public onMouseEnter(event: Events.Mouse): any {}

    public onMouseLeave(event: Events.Mouse): any {}

    public onMouseOver(event: Events.Mouse): any {}

    public onMouseOut(event: Events.Mouse): any {}

    public onKeyDown(event: Events.Keyboard): any {}

    public onKeyPress(event: Events.Keyboard): any {}

    public onKeyUp(event: Events.Keyboard): any {}

    public onFocus(event: Events.Focus): any {}

    public onBlur(event: Events.Focus): any {}

    public onInput(event: Events.Input): any {}

    public onChange(event: Events.Base): any {}

    public onSubmit(event: Events.Base): any {}

    public onScroll(event: Events.Base): any {}

    public onError(event: Events.Error): any {}

    public onResize(event: Events.UI): any {}

    public onSelect(event: Events.Base): any {}

    public onTouchStart(event: Events.Touch): any {}

    public onTouchMove(event: Events.Touch): any {}

    public onTouchEnd(event: Events.Touch): any {}

    public onTouchCancel(event: Events.Touch): any {}

    public onAnimationStart(event: Events.Animation): any {}

    public onAnimationEnd(event: Events.Animation): any {}

    public onAnimationIteration(event: Events.Animation): any {}

    public onTransitionStart(event: Events.Transition): any {}

    public onTransitionEnd(event: Events.Transition): any {}

    public onTransitionCancel(event: Events.Transition): any {}
}

export type ComponentDefinition = { tag: string, ctor: (new (element: HTMLElement) => Component) };

export class Debounce {
    /** @internal */
    private readonly _callback: (...args: any[]) => void;
    /** @internal */
    private _timeoutId: number | null;

    constructor(callback: Function, wait: number) {
        this._timeoutId = null;
        this._callback = (...args: any[]): void => {
            window.clearTimeout(this._timeoutId);
            this._timeoutId = window.setTimeout((): void => {
                callback.apply(null, args);
            }, wait);
        };
    }

    public call(...args: any[]): void {
        this._callback.apply(this, args);
    }
}

export function escapeHTML(value: { toString(): string }): string {
    return value.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function Event(type: keyof GlobalEventHandlersEventMap) {
    return function <T extends Component>(_: T, key: keyof T & string, propertyDescriptor: TypedPropertyDescriptor<(event?: Events.Base) => void>) {
        return {
            get: function (): (event?: Events.Base) => void {
                const method = propertyDescriptor.value.bind(this);
                method.toString = (): string => this.on(type, key);
                return method;
            },
            enumerable: true,
            configurable: true
        };
    }
}

export namespace Events {
    export type Base<T extends HTMLElement = HTMLElement> = Event & { target: T }
    export type Mouse<T extends HTMLElement = HTMLElement> = MouseEvent & Base<T>;
    export type Keyboard<T extends HTMLElement = HTMLElement> = KeyboardEvent & Base<T>;
    export type Focus<T extends HTMLElement = HTMLElement> = FocusEvent & Base<T>;
    export type Input<T extends HTMLElement = HTMLElement> = InputEvent & Base<T>;
    export type Error<T extends HTMLElement = HTMLElement> = ErrorEvent & Base<T>;
    export type UI<T extends HTMLElement = HTMLElement> = UIEvent & Base<T>;
    export type Touch<T extends HTMLElement = HTMLElement> = TouchEvent & Base<T>;
    export type Animation<T extends HTMLElement = HTMLElement> = AnimationEvent & Base<T>;
    export type Transition<T extends HTMLElement = HTMLElement> = TransitionEvent & Base<T>;
}

function formatDate(format: string): string {
    const date: Date = this;
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

type Item<T> = {
    value: T;
    expiry?: number;
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

    export function setItem<T>(key: string, value: T, ttl: number = undefined): void {
        const item: Item<T> = {
            value,
            expiry: ttl !== undefined ? new Date().getTime() + ttl : undefined
        };

        localStorage.setItem(key, JSON.stringify(item));
    }
}

export function State<T extends Component>(target: T, key: string): void {
    const field: symbol = Symbol(key);
    Object.defineProperty(target, field, {
        writable: true,
        enumerable: false,
        configurable: true,
    });

    const getter = function () {
        return this[field];
    };

    const setter = function (newValue: any): void {
        if (this[field] === newValue) {
            return;
        }

        this[field] = newValue;
        this.update();

        for (const [subscriber, state] of this.subscribers) {
            if (subscriber === this) {
                continue;
            }

            if (state === key) {
                if (subscriber instanceof Component) {
                    subscriber.update();
                    continue;
                }

                subscriber();
            }
        }
    };

    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}