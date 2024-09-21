/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

/* global Element, NodeList, HTMLCollection */

export class DomSurfer {
  constructor (value) {
    this.value = value;
    try {
      this.add(value);
    } catch (e) {
      console.error(e.message);
    }
  }

  add (value) {
    if (!Array.isArray(this.elements)) this.elements = [];

    if (!value || typeof value === 'boolean') {
      // Do nothing ¯\_(ツ)_/¯
    } else if (typeof value === 'function') {
      window.addEventListener('DOMContentLoaded', value);
    } else if (typeof value === 'string') {
      if (value.startsWith('<')) {
        this.add(DomSurfer.elementsFromHtmlString(value));
      } else {
        this.add(document.querySelectorAll(value));
      }
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

  filter (query) {
    if (typeof query === 'string') {
      this.elements = this.elements.filter((element) => element.matches(query));
    } else if (typeof query === 'function') {
      this.elements = this.elements.filter((element, index) => query(element, index));
    } else {
      console.warn('query should be a string or function', query);
    }

    return this;
  }

  static isElement (value) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#node_type_constants
    return value !== null &&
           typeof value === 'object' &&
           'nodeType' in value &&
           [Element.ELEMENT_NODE, Element.DOCUMENT_NODE].includes(value.nodeType);
  }

  static isObject (value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  static assertIsElement (value) {
    const isElement = DomSurfer.isElement(value);
    console.assert(isElement, 'expected to be an element', value, this.value);
    return isElement;
  }

  static elementClassesFromRegex (element, regex) {
    return Array.from(element.classList).filter((x) => regex.test(x));
  }

  static isBoolean (value) {
    return value === true || value === false;
  }

  static elementsFromHtmlString (html = '') {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.children;
  }

  hasOneElement () {
    return this.elements.length === 1 && DomSurfer.isElement(this.first());
  }

  assertHasOneElement () {
    const hasOneElement = this.hasOneElement();
    console.assert(hasOneElement, 'expected only one element', this.elements);
    return hasOneElement;
  }

  first () {
    return this.elements[0];
  }

  $first () {
    return new DomSurfer(this.elements[0]);
  }

  getAt (index) { // named `getAt` because `get` is a reserved name
    return this.elements.at(index);
  }

  $getAt (index) {
    return new DomSurfer(this.elements.at(index));
  }

  any () {
    return this.elements.length > 0;
  }

  none () {
    return !this.any();
  }

  find (selector) {
    this.assertHasOneElement();
    return new DomSurfer(this.first().querySelectorAll(selector));
  }

  hasClass (cssClass) {
    this.assertHasOneElement();
    const element = this.first();
    if (cssClass instanceof RegExp) {
      return DomSurfer.elementClassesFromRegex(element, cssClass).length > 0;
    } else {
      return element.classList.contains(cssClass);
    }
  }

  lacksClass (cssClass) {
    return !this.hasClass(cssClass);
  }

  attr (attribute) {
    const element = this.first();
    return element.attributes[attribute]?.value;
  }

  data (name) {
    const element = this.first();
    if (name in element.dataset) {
      return element.dataset[name];
    } else {
      return this.attr(`data-${name}`);
    }
  }

  css (value) {
    const style = this.first()?.style;
    if (!style) return;

    if (typeof value === 'undefined') {
      return Array.from(style)
        .map((key) => ({ key, value: style[key] }))
        .reduce((accumulator, item) =>
          Object.assign(accumulator, { [item.key]: item.value }), {}
        );
    } else if (typeof value === 'string') {
      return style[value];
    } else if (DomSurfer.isObject(value)) {
      for (const [key, objValue] of Object.entries(value)) {
        // eslint-disable-next-line no-unneeded-ternary
        style[key] = objValue ? objValue : null;
      }
    }
  }

  parent () {
    const element = this.first();
    return element.parentElement;
  }

  $parent () {
    return new DomSurfer(this.parent());
  }

  children () {
    const element = this.first();
    return element.children;
  }

  $children () {
    return new DomSurfer(this.children());
  }

  closest (selector) {
    let candidate = this.first();
    while (DomSurfer.isElement(candidate)) {
      if (candidate.matches(selector)) return candidate;
      candidate = candidate.parentElement;
    }
  }

  $closest (selector) {
    return new DomSurfer(this.closest(selector));
  }

  each (callback) {
    for (let index = 0; index < this.elements.length; index++) {
      const element = this.elements[index];
      if (DomSurfer.isElement(element)) callback(element, index);
    }
    return this;
  }

  $each (callback) {
    return this.each((element, index) =>
      callback(new DomSurfer(element), index)
    );
  }

  append (...elements) {
    return this.each((e) => {
      elements.forEach((element) => {
        if (element instanceof DomSurfer) {
          e.append(...element.elements);
        } else if (Symbol.iterator in Object(element)) {
          e.append(...element);
        } else {
          e.append(element);
        }
      });
    });
  }

  addClass (cssClass) {
    return this.each((element) => element.classList.add(cssClass));
  }

  removeClass (cssClass) {
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

  toggleClass (cssClass) {
    return this.each((element) => element.classList.toggle(cssClass));
  }

  setClass (cssClass, booleanOrPredicate) {
    let predicate = booleanOrPredicate;
    if (DomSurfer.isBoolean(booleanOrPredicate)) {
      predicate = () => booleanOrPredicate;
    } else if (typeof booleanOrPredicate !== 'function') {
      console.warn('[setClass] Invalid booleanOrPredicate');
      return;
    }

    return this.each((element) => {
      if (
        predicate({
          element,
          $element: new DomSurfer(element),
          e: element,
          $e: new DomSurfer(element)
        })
      ) {
        element.classList.add(cssClass);
      } else {
        element.classList.remove(cssClass);
      }
    });
  }

  on (eventName, callback) {
    return this.each((element) => element.addEventListener(eventName, callback));
  }

  onClick (callback) {
    return this.on('click', callback);
  }

  onSubmit (callback) {
    return this.on('submit', callback);
  }

  onLoad (callback) {
    return this.on('load', callback);
  }

  show () {
    return this.each((element) => { element.style.display = null; });
  }

  hide () {
    return this.each((element) => { element.style.display = 'none'; });
  }

  innerHtml (html = null) {
    if (html === null) return this.first().innerHtml;
    return this.each((element) => { element.innerHTML = html; });
  }

  innerText (text = null) {
    if (text === null) return this.first().innerText;
    return this.each((element) => { element.innerText = text; });
  }
}

function $ (value) {
  return new DomSurfer(value);
}

export default $;
