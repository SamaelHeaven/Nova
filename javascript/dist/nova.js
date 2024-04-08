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
        return;
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
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        }
        else {
            fromValue = fromNode.getAttribute(attrName);
            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
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
                fromNode.removeAttributeNS(attrNamespaceURI, attrName);
            }
        }
        else {
            if (!toNode.hasAttribute(attrName)) {
                fromNode.removeAttribute(attrName);
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
    return template.content.childNodes[0];
}
function createFragmentFromRange(str) {
    if (!range) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
}
function createFragmentFromWrap(str) {
    var fragment = doc.createElement('body');
    fragment.innerHTML = str;
    return fragment.childNodes[0];
}
function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
        return createFragmentFromTemplate(str);
    }
    else if (HAS_RANGE_SUPPORT) {
        return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
}
function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
        return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
        return fromNodeName === toNodeName.toUpperCase();
    }
    else if (toCodeStart <= 90 && fromCodeStart >= 97) {
        return toNodeName === fromNodeName.toUpperCase();
    }
    else {
        return false;
    }
}
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
}
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}
function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        }
        else {
            fromEl.removeAttribute(name);
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
                parentName = parentNode && parentNode.nodeName.toUpperCase();
            }
            if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
                if (fromEl.hasAttribute('selected') && !toEl.selected) {
                    fromEl.setAttribute('selected', 'selected');
                    fromEl.removeAttribute('selected');
                }
                parentNode.selectedIndex = -1;
            }
        }
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    }, INPUT: function (fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');
        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }
        if (!toEl.hasAttribute('value')) {
            fromEl.removeAttribute('value');
        }
    }, TEXTAREA: function (fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }
        var firstChild = fromEl.firstChild;
        if (firstChild) {
            var oldValue = firstChild.nodeValue;
            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return;
            }
            firstChild.nodeValue = newValue;
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
                    curChild = optgroup.firstChild;
                }
                else {
                    if (nodeName === 'OPTION') {
                        if (curChild.hasAttribute('selected')) {
                            selectedIndex = i;
                            break;
                        }
                        i++;
                    }
                    curChild = curChild.nextSibling;
                    if (!curChild && optgroup) {
                        curChild = optgroup.nextSibling;
                        optgroup = null;
                    }
                }
            }
            fromEl.selectedIndex = selectedIndex;
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
        return (node.getAttribute && node.getAttribute('id')) || node.id;
    }
}
function morphdomFactory(morphAttrs) {
    return function morphdom(fromNode, toNode, options) {
        if (!options) {
            options = {};
        }
        if (typeof toNode === 'string') {
            if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML' || fromNode.nodeName === 'BODY') {
                var toNodeHtml = toNode;
                toNode = doc.createElement('html');
                toNode.innerHTML = toNodeHtml;
            }
            else {
                toNode = toElement(toNode);
            }
        }
        else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
            toNode = toNode.firstElementChild;
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
            return parent.appendChild(child);
        };
        var childrenOnly = options.childrenOnly === true;
        var fromNodesLookup = Object.create(null);
        var keyedRemovalList = [];
        function addKeyedRemoval(key) {
            keyedRemovalList.push(key);
        }
        function walkDiscardedChildNodes(node, skipKeyedNodes) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = undefined;
                    if (skipKeyedNodes && (key = getNodeKey(curChild))) {
                        addKeyedRemoval(key);
                    }
                    else {
                        onNodeDiscarded(curChild);
                        if (curChild.firstChild) {
                            walkDiscardedChildNodes(curChild, skipKeyedNodes);
                        }
                    }
                    curChild = curChild.nextSibling;
                }
            }
        }
        function removeNode(node, parentNode, skipKeyedNodes) {
            if (onBeforeNodeDiscarded(node) === false) {
                return;
            }
            if (parentNode) {
                parentNode.removeChild(node);
            }
            onNodeDiscarded(node);
            walkDiscardedChildNodes(node, skipKeyedNodes);
        }
        function indexTree(node) {
            if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = getNodeKey(curChild);
                    if (key) {
                        fromNodesLookup[key] = curChild;
                    }
                    indexTree(curChild);
                    curChild = curChild.nextSibling;
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
                        morphEl(unmatchedFromEl, curChild);
                    }
                    else {
                        handleNodeAdded(curChild);
                    }
                }
                else {
                    handleNodeAdded(curChild);
                }
                curChild = nextSibling;
            }
        }
        function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
            while (curFromNodeChild) {
                var fromNextSibling = curFromNodeChild.nextSibling;
                if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
                    addKeyedRemoval(curFromNodeKey);
                }
                else {
                    removeNode(curFromNodeChild, fromEl, true);
                }
                curFromNodeChild = fromNextSibling;
            }
        }
        function morphEl(fromEl, toEl, childrenOnly) {
            var toElKey = getNodeKey(toEl);
            if (toElKey) {
                delete fromNodesLookup[toElKey];
            }
            if (!childrenOnly) {
                if (onBeforeElUpdated(fromEl, toEl) === false) {
                    return;
                }
                morphAttrs(fromEl, toEl);
                onElUpdated(fromEl);
                if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                    return;
                }
            }
            if (fromEl.nodeName !== 'TEXTAREA') {
                morphChildren(fromEl, toEl);
            }
            else {
                specialElHandlers.TEXTAREA(fromEl, toEl);
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
            outer: while (curToNodeChild) {
                toNextSibling = curToNodeChild.nextSibling;
                curToNodeKey = getNodeKey(curToNodeChild);
                while (!skipFrom && curFromNodeChild) {
                    fromNextSibling = curFromNodeChild.nextSibling;
                    if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
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
                                            isCompatible = false;
                                        }
                                        else {
                                            fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                                            if (curFromNodeKey) {
                                                addKeyedRemoval(curFromNodeKey);
                                            }
                                            else {
                                                removeNode(curFromNodeChild, fromEl, true);
                                            }
                                            curFromNodeChild = matchingFromEl;
                                            curFromNodeKey = getNodeKey(curFromNodeChild);
                                        }
                                    }
                                    else {
                                        isCompatible = false;
                                    }
                                }
                            }
                            else if (curFromNodeKey) {
                                isCompatible = false;
                            }
                            isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                            if (isCompatible) {
                                morphEl(curFromNodeChild, curToNodeChild);
                            }
                        }
                        else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                            isCompatible = true;
                            if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                                curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                            }
                        }
                    }
                    if (isCompatible) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }
                    if (curFromNodeKey) {
                        addKeyedRemoval(curFromNodeKey);
                    }
                    else {
                        removeNode(curFromNodeChild, fromEl, true);
                    }
                    curFromNodeChild = fromNextSibling;
                }
                if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
                    if (!skipFrom) {
                        addChild(fromEl, matchingFromEl);
                    }
                    morphEl(matchingFromEl, curToNodeChild);
                }
                else {
                    var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
                    if (onBeforeNodeAddedResult !== false) {
                        if (onBeforeNodeAddedResult) {
                            curToNodeChild = onBeforeNodeAddedResult;
                        }
                        if (curToNodeChild.actualize) {
                            curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                        }
                        addChild(fromEl, curToNodeChild);
                        handleNodeAdded(curToNodeChild);
                    }
                }
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
            }
            ;
            cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
            var specialElHandler = specialElHandlers[fromEl.nodeName];
            if (specialElHandler) {
                specialElHandler(fromEl, toEl);
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
                        morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
                    }
                }
                else {
                    morphedNode = toNode;
                }
            }
            else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
                if (toNodeType === morphedNodeType) {
                    if (morphedNode.nodeValue !== toNode.nodeValue) {
                        morphedNode.nodeValue = toNode.nodeValue;
                    }
                    return morphedNode;
                }
                else {
                    morphedNode = toNode;
                }
            }
        }
        if (morphedNode === toNode) {
            onNodeDiscarded(fromNode);
        }
        else {
            if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
                return;
            }
            morphEl(morphedNode, toNode, childrenOnly);
            if (keyedRemovalList) {
                for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
                    var elToRemove = fromNodesLookup[keyedRemovalList[i]];
                    if (elToRemove) {
                        removeNode(elToRemove, elToRemove.parentNode, false);
                    }
                }
            }
        }
        if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
            if (morphedNode.actualize) {
                morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
            }
            fromNode.parentNode.replaceChild(morphedNode, fromNode);
        }
        return morphedNode;
    };
}
var morphdom = morphdomFactory(morphAttrs);
export class Application {
    constructor() {
        this._morphdomOptions = {
            onBeforeElUpdated: function (fromElement, toElement) {
                return !fromElement.isEqualNode(toElement);
            }
        };
        this._eventNames = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "keydown", "keypress", "keyup", "focus", "blur", "input", "change", "submit", "scroll", "error", "resize", "select", "touchstart", "touchmove", "touchend", "touchcancel", "animationstart", "animationend", "animationiteration", "transitionstart", "transitionend", "transitioncancel"];
        this._components = [];
    }
    static launch(components) {
        if (Application._instance !== null) {
            throw new Error("Application has already been launched");
        }
        const app = Application._getInstance();
        app._components = [...components];
        app._initializeComponents();
    }
    static updateComponent(component) {
        Application._throwIfUninitialized();
        Application._getInstance()._updateComponent(component);
    }
    static getComponent(clazz, element = document.documentElement) {
        var _a;
        Application._throwIfUninitialized();
        const name = Application._getInstance()._components.find(component => component.class == clazz).name;
        return ((_a = element.getElementsByTagName(name)) === null || _a === void 0 ? void 0 : _a.component) || null;
    }
    static getComponents(clazz, element = document.documentElement) {
        Application._throwIfUninitialized();
        const name = Application._getInstance()._components.find(component => component.class == clazz).name;
        const components = [];
        for (const componentElement of Array.from(element.getElementsByTagName(name))) {
            if (componentElement.component) {
                components.push(componentElement.component);
            }
        }
        return components;
    }
    static _getInstance() {
        var _a;
        return (_a = Application._instance) !== null && _a !== void 0 ? _a : (Application._instance = new Application());
    }
    static _throwIfUninitialized() {
        if (Application._instance === null) {
            throw new Error("Application has not been launched");
        }
    }
    _registerEventListeners(component) {
        for (const key of component.getKeys()) {
            const eventType = key.substring(2).toLowerCase();
            if (this._eventNames.includes(eventType)) {
                component.element.addEventListener(eventType, (event) => {
                    component[key](event);
                });
            }
        }
    }
    _updateComponent(component) {
        const newElement = component.element.cloneNode(false);
        const renderedContent = component.render();
        if (Validation.isNullOrUndefined(renderedContent)) {
            return;
        }
        newElement.innerHTML = component.render();
        morphdom(component.element, newElement, this._morphdomOptions);
    }
    _initializeComponents() {
        for (const component of this._components) {
            this._initializeComponent(component);
        }
    }
    _initializeComponent(component) {
        const app = this;
        class ComponentElement extends HTMLElement {
            connectedCallback() {
                this.component = new component.class(this);
                this._observeAttributes();
                this.component.onInit();
                app._registerEventListeners(this.component);
                app._updateComponent(this.component);
                this.component.onAppear();
            }
            disconnectedCallback() {
                this.component.onDestroy();
            }
            _observeAttributes() {
                const observerConfig = { attributes: true, subtree: false };
                const observer = new MutationObserver((mutationsList, _) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'attributes') {
                            this.component.onAttributeChanged(mutation.attributeName, mutation.oldValue, this.getAttribute(mutation.attributeName));
                        }
                    }
                });
                observer.observe(this, observerConfig);
            }
        }
        customElements.define(component.name, ComponentElement);
    }
}
Application._instance = null;
export class Component {
    constructor(element) {
        this._element = element;
    }
    render() {
        return undefined;
    }
    get element() {
        return this._element;
    }
    update(state) {
        for (const key of this.getKeys()) {
            if (this[key] === state) {
                this[key] = state;
            }
        }
    }
    getComponent(clazz, element) {
        return Application.getComponent(clazz, element);
    }
    getComponents(clazz, element) {
        return Application.getComponents(clazz, element);
    }
    onInit() { }
    onAppear() { }
    onDestroy() { }
    onAttributeChanged(attribute, oldValue, newValue) { }
    onClick(event) { }
    onDblClick(event) { }
    onMouseDown(event) { }
    onMouseUp(event) { }
    onMouseMove(event) { }
    onMouseEnter(event) { }
    onMouseLeave(event) { }
    onMouseOver(event) { }
    onMouseOut(event) { }
    onKeyDown(event) { }
    onKeyPress(event) { }
    onKeyUp(event) { }
    onFocus(event) { }
    onBlur(event) { }
    onInput(event) { }
    onChange(event) { }
    onSubmit(event) { }
    onScroll(event) { }
    onError(event) { }
    onResize(event) { }
    onSelect(event) { }
    onTouchStart(event) { }
    onTouchMove(event) { }
    onTouchEnd(event) { }
    onTouchCancel(event) { }
    onAnimationStart(event) { }
    onAnimationEnd(event) { }
    onAnimationIteration(event) { }
    onTransitionStart(event) { }
    onTransitionEnd(event) { }
    onTransitionCancel(event) { }
    getKeys() {
        let keys = [];
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
}
export class Debounce {
    constructor(callback, wait) {
        this._timeoutId = null;
        this._callback = (...args) => {
            window.clearTimeout(this._timeoutId);
            this._timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    }
    call(...args) {
        this._callback.apply(this, args);
    }
}
export var Format;
(function (Format) {
    function date(arg, format) {
        let date;
        if (arg instanceof Date) {
            date = arg;
        }
        else if (arg === "today" || Validation.isNumber(arg) || Validation.isNullOrUndefinedOrEmpty(arg)) {
            date = new Date();
        }
        else if (arg === "tomorrow") {
            date = new Date();
            date.setDate(date.getDate() + 1);
        }
        else if (arg === "yesterday") {
            date = new Date();
            date.setDate(date.getDate() - 1);
        }
        else {
            date = new Date(arg);
        }
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return format.replace(/(d{1,4}|m{1,4}|y{2,4}|h{1,2}|H{1,2}|M{1,2}|s{1,2}|l|L|t{1,2}|T{1,2}'[^']*'|"[^"]*")/g, function (match) {
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
    Format.date = date;
    function titleCase(arg) {
        const str = String(arg).trim();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    Format.titleCase = titleCase;
    function upperCase(arg) {
        const str = String(arg).trim();
        return str.toUpperCase();
    }
    Format.upperCase = upperCase;
    function lowerCase(arg) {
        const str = String(arg).trim();
        return str.toLowerCase();
    }
    Format.lowerCase = lowerCase;
    function percentage(arg, digits) {
        const value = Number(arg);
        return (value).toFixed(digits) + "%";
    }
    Format.percentage = percentage;
    function decimal(arg, digits) {
        const value = Number(arg);
        return value.toFixed(digits);
    }
    Format.decimal = decimal;
    function currency(amount, currency = "USD") {
        return amount.toLocaleString(undefined, {
            style: 'currency',
            currency: currency
        });
    }
    Format.currency = currency;
})(Format || (Format = {}));
export var LocalStorage;
(function (LocalStorage) {
    function getItem(key) {
        const itemString = localStorage.getItem(key);
        if (!itemString) {
            return null;
        }
        const item = JSON.parse(itemString);
        if (item.expiry !== undefined && item.expiry < new Date().getTime()) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }
    LocalStorage.getItem = getItem;
    function setItem(key, value, ttl = undefined) {
        const item = {
            value,
            expiry: ttl !== undefined ? new Date().getTime() + ttl : undefined
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
    LocalStorage.setItem = setItem;
})(LocalStorage || (LocalStorage = {}));
export function State(target, key) {
    let value = target[key];
    const getter = function () {
        return value;
    };
    const setter = function (newValue) {
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
export var Validation;
(function (Validation) {
    function isEmail(email) {
        return !!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
    Validation.isEmail = isEmail;
    function isPhoneNumber(phoneNumber) {
        return !!phoneNumber.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
    }
    Validation.isPhoneNumber = isPhoneNumber;
    function isDateEquals(date, expected) {
        return date.getTime() === expected.getTime();
    }
    Validation.isDateEquals = isDateEquals;
    function isDateAfter(date, minDate) {
        return date.getTime() > minDate.getTime();
    }
    Validation.isDateAfter = isDateAfter;
    function isDateBefore(date, maxDate) {
        return date.getTime() < maxDate.getTime();
    }
    Validation.isDateBefore = isDateBefore;
    function isDateBetween(date, minDate, maxDate) {
        return date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime();
    }
    Validation.isDateBetween = isDateBetween;
    function isPositiveInteger(value) {
        return !!value.match(/^\d+$/);
    }
    Validation.isPositiveInteger = isPositiveInteger;
    function isNegativeInteger(value) {
        return !!value.match(/^-\d+$/);
    }
    Validation.isNegativeInteger = isNegativeInteger;
    function isInteger(value) {
        return !!value.match(/^(-?\d+)$/);
    }
    Validation.isInteger = isInteger;
    function isPositiveNumeric(value) {
        return !!value.match(/^\d+(\.\d+)?$/);
    }
    Validation.isPositiveNumeric = isPositiveNumeric;
    function isNegativeNumeric(value) {
        return !!value.match(/^-\d+(\.\d+)?$/);
    }
    Validation.isNegativeNumeric = isNegativeNumeric;
    function isNumeric(value) {
        return !!value.match(/^(-?\d+(\.\d+)?)$/);
    }
    Validation.isNumeric = isNumeric;
    function isInRange(value, min, max) {
        return value >= min && value <= max;
    }
    Validation.isInRange = isInRange;
    function isString(value) {
        return typeof value === "string";
    }
    Validation.isString = isString;
    function isNumber(value) {
        return typeof value === "number";
    }
    Validation.isNumber = isNumber;
    function isBoolean(value) {
        return typeof value === "boolean";
    }
    Validation.isBoolean = isBoolean;
    function isArray(value) {
        return Array.isArray(value);
    }
    Validation.isArray = isArray;
    function isJson(value) {
        try {
            JSON.parse(value);
            return true;
        }
        catch (_) {
            return false;
        }
    }
    Validation.isJson = isJson;
    function isFiniteNumber(value) {
        return typeof value === "number" && isFinite(value);
    }
    Validation.isFiniteNumber = isFiniteNumber;
    function isNan(value) {
        return isNaN(value);
    }
    Validation.isNan = isNan;
    function isInfinity(value) {
        return value === Infinity || value === -Infinity;
    }
    Validation.isInfinity = isInfinity;
    function isRegex(value, regex) {
        return regex.test(value);
    }
    Validation.isRegex = isRegex;
    function isEmpty(value) {
        return value.length === 0;
    }
    Validation.isEmpty = isEmpty;
    function isNull(value) {
        return value === null;
    }
    Validation.isNull = isNull;
    function isUndefined(value) {
        return value === undefined;
    }
    Validation.isUndefined = isUndefined;
    function isNullOrUndefined(value) {
        return value === null || value === undefined;
    }
    Validation.isNullOrUndefined = isNullOrUndefined;
    function isNullOrUndefinedOrEmpty(value) {
        return value === null || value === undefined || value.length <= 0;
    }
    Validation.isNullOrUndefinedOrEmpty = isNullOrUndefinedOrEmpty;
})(Validation || (Validation = {}));
