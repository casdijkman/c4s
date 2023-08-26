/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

export class DomSurfer {
    constructor(value) {
        this.value = value;
        try {
            this.add(value);
        } catch (e) {
            console.error(e.message);
        }
    }

    add(value) {
        if (! Array.isArray(this.elements)) this.elements = new Array();

        if (!value || typeof value === 'boolean') {
            // Do nothing
        } else if (typeof value === 'function') {
            window.addEventListener('DOMContentLoaded', value);
        } else if (typeof value === 'string') {
            this.elements.push(...Array.from(document.querySelectorAll(value)));
        } else if (DomSurfer.isElement(value)) {
            this.elements.push(value);
        } else if (value instanceof NodeList || value instanceof HTMLCollection) {
            this.elements.push(...Array.from(value));
        } else if (Array.isArray(value)) {
            this.elements.push(...value);
        } else if (value instanceof DomSurfer) {
            console.warn('Nesting DomSurfer instances');
            this.elements.push(...value.elements);
        } else {
            throw new Error(`Unsupported value for constructor '${value}'`);
        }

        // Ensure all are elements and remove duplicates
        this.elements = this
            .elements
            .filter((element) => DomSurfer.isElement(element))
            .filter((element, index, array) => array.indexOf(element) === index);
        return this;
    }

    static isElement(value) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#node_type_constants
        const elementNode = 1;
        const documentNode = 9;
        return value !== null &&
               typeof value === 'object' &&
               'nodeType' in value &&
               [elementNode, documentNode].includes(value.nodeType);
    }

    static assertIsElement(value) {
        const isElement = DomSurfer.isElement(value);
        console.assert(isElement, 'expected to be an element', value, this.value);
        return isElement;
    }

    static elementClassesFromRegex(element, regex) {
        return Array.from(element.classList).filter((x) => regex.test(x));
    }

    hasOneElement() {
        return this.elements.length === 1 && DomSurfer.isElement(this.first());
    }

    assertHasOneElement() {
        const hasOneElement = this.hasOneElement();
        console.assert(hasOneElement, 'expected only one element', this.elements);
        return hasOneElement;
    }

    first() {
        return this.elements[0];
    }

    any() {
        return this.elements.length > 0;
    }

    none() {
        return !this.any();
    }

    find(selector) {
        this.assertHasOneElement();
        return $(this.first().querySelectorAll(selector));
    }

    hasClass(cssClass) {
        this.assertHasOneElement();
        const element = this.first();
        if (cssClass instanceof RegExp) {
            return DomSurfer.elementClassesFromRegex(element, cssClass).length > 0;
        } else {
            return element.classList.contains(cssClass);
        }
    }

    lacksClass(cssClass) {
        return !this.hasClass(cssClass);
    }

    attr(attribute) {
        const element = this.first();
        return element.attributes[attribute]?.value;
    }

    data(name) {
        const element = this.first();
        if (name in element.dataset) {
            return element.dataset[name];
        } else {
            return this.attr(`data-${name}`);
        }
    }

    parent() {
        const element = this.first();
        return element.parentElement;
    }

    $parent() {
        const element = this.first();
        return new DomSurfer(element.parentElement);
    }

    children() {
        const element = this.first();
        return element.children;
    }

    $children() {
        const element = this.first();
        return new DomSurfer(element.children);
    }

    closest(selector) {
        let candidate = this.first();
        while (DomSurfer.isElement(candidate)) {
            if (candidate.matches(selector)) return candidate;
            candidate = candidate.parentElement;
        }
    }

    each(callback) {
        for (let index = 0; index < this.elements.length; index++) {
            const element = this.elements[index];
            if (DomSurfer.isElement(element)) callback(element, index);
        }
        return this;
    }

    $each(callback) {
        return this.each((element, index) => callback($(element), index));
    }

    addClass(cssClass) {
        return this.each((element) => element.classList.add(cssClass));
    }

    removeClass(cssClass) {
        return this.each((element) => {
            const classes = [];
            if (cssClass instanceof RegExp) {
                classes.push(...DomSurfer.elementClassesFromRegex(element, cssClass));
            } else {
                classes.push(cssClass);
            }
            element.classList.remove(...classes);
        });
    }

    toggleClass(cssClass) {
        return this.each((element) => element.classList.toggle(cssClass));
    }

    on(eventName, callback) {
        return this.each((element) => element.addEventListener(eventName, callback));
    }

    onClick(callback) {
        return this.on('click', callback);
    }

    onSubmit(callback) {
        return this.on('submit', callback);
    }

    onLoad(callback) {
        return this.on('load', callback);
    }

    show() {
        return this.each((element) => { element.style.display = null; });
    }

    hide() {
        return this.each((element) => { element.style.display = 'none'; });
    }
}

function $(value) {
    return new DomSurfer(value);
}

export default $;
