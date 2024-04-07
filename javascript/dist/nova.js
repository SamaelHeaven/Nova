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
        /** @internal */
        this._eventNames = [
            "click",
            "dblclick",
            "mousedown",
            "mouseup",
            "mousemove",
            "mouseenter",
            "mouseleave",
            "mouseover",
            "mouseout",
            "keydown",
            "keypress",
            "keyup",
            "focus",
            "blur",
            "input",
            "change",
            "submit",
            "scroll",
            "load",
            "unload",
            "error",
            "resize",
            "select",
            "touchstart",
            "touchmove",
            "touchend",
            "touchcancel",
            "animationstart",
            "animationend",
            "animationiteration",
            "transitionstart",
            "transitionend",
            "transitioncancel"
        ];
        this._components = [];
        this._morphdomOption = {
            onBeforeElUpdated: function (fromElement, toElement) {
                return !fromElement.isEqualNode(toElement);
            }
        };
    }
    static launch(components) {
        const app = this._getInstance();
        for (const component of components) {
            app._components.push({
                name: Application._getComponentName(component.name),
                ctor: component
            });
        }
        app._updateElement(document.documentElement);
    }
    static update(component) {
        if (Application._instance === null) {
            return;
        }
        Application._getInstance()._updateComponent(component);
    }
    static getComponent(clazz) {
        var _a;
        if (Application._instance === null) {
            return null;
        }
        const name = Application._getComponentName(clazz.name);
        const element = document.querySelector(name);
        if (!element) {
            return null;
        }
        return (_a = element.component) !== null && _a !== void 0 ? _a : null;
    }
    static getComponents(clazz) {
        if (Application._instance === null) {
            return [];
        }
        const name = Application._getComponentName(clazz.name);
        const elements = Array.from(document.querySelectorAll(name));
        const result = [];
        for (const element of elements) {
            if (element.component) {
                result.push(element.component);
            }
        }
        return result;
    }
    /** @internal */
    static _getInstance() {
        var _a;
        return (_a = Application._instance) !== null && _a !== void 0 ? _a : (Application._instance = new Application());
    }
    /** @internal */
    static _getComponentName(input) {
        let result = '';
        for (let i = 0; i < input.length; i++) {
            if (i > 0 && input[i] === input[i].toUpperCase()) {
                result += '-';
            }
            result += input[i].toLowerCase();
        }
        return result;
    }
    /** @internal */
    _updateElement(root) {
        for (const component of this._components) {
            for (const element of Array.from(root.querySelectorAll(component.name))) {
                const loaded = element.attributes.getNamedItem("nova-loaded");
                if (loaded && loaded.value === "true") {
                    continue;
                }
                element.setAttribute("nova-loaded", "true");
                element.style.display = "inline-block";
                element.style.width = "fit-content";
                element.style.height = "fit-content";
                const componentInstance = new component.ctor(element);
                this._registerEventListeners(componentInstance);
                element.component = componentInstance;
                element.innerHTML = componentInstance.render();
            }
        }
    }
    /** @internal */
    _registerEventListeners(componentInstance) {
        for (const key of componentInstance.getKeys()) {
            if (typeof componentInstance[key] === "function" && key.startsWith('on')) {
                const eventType = key.substring(2).toLowerCase();
                if (this._eventNames.indexOf(eventType) !== -1) {
                    componentInstance.element.addEventListener(eventType, (event) => {
                        componentInstance[key](event);
                    });
                }
            }
        }
    }
    /** @internal */
    _updateComponent(component) {
        const newElement = component.element.cloneNode(false);
        newElement.innerHTML = component.render();
        morphdom(component.element, newElement, this._morphdomOption);
        this._updateElement(component.element);
    }
}
/** @internal */
Application._instance = null;
export class Component {
    constructor(element) {
        this.element = element;
    }
    input(key, defaultValue = null) {
        const attribute = this.element.attributes.getNamedItem(key);
        if (attribute) {
            return attribute.value;
        }
        return defaultValue;
    }
    update(value) {
        for (const key of this.getKeys()) {
            if (this[key] === value) {
                this[key] = value;
            }
        }
    }
    getKeys() {
        let keys = [];
        let prototype = this;
        while (prototype) {
            const parentPrototype = Object.getPrototypeOf(prototype);
            if (parentPrototype && Object.getPrototypeOf(parentPrototype)) {
                keys = keys.concat(Object.getOwnPropertyNames(prototype));
            }
            prototype = parentPrototype;
        }
        keys = [...new Set(keys)];
        return keys;
    }
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
    onLoad(event) { }
    onUnload(event) { }
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
}
export class LocalStorage {
    static getItem(key) {
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
    static setItem(key, value, ttl = undefined) {
        const item = {
            value,
            expiry: ttl !== undefined ? new Date().getTime() + ttl : undefined
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
}
export function State(target, key) {
    let value = target[key];
    const getter = function () {
        return value;
    };
    const setter = function (newVal) {
        value = newVal;
        if (this instanceof Component) {
            Application.update(this);
        }
    };
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}
