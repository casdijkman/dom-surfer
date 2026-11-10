<!--
SPDX-FileCopyrightText: 2025 Cas Dijkman

SPDX-License-Identifier: GFDL-1.3-only
-->

## API

# DomSurfer API Reference

A lightweight jQuery-like DOM utility. `$()` creates a `DomSurfer` instance; methods that mutate or traverse return `this` (chainable) unless noted otherwise. Methods prefixed with `$` wrap results in a new `DomSurfer` instance instead of returning raw DOM nodes.

---

### `add(value)`

Adds one or more elements to the collection. Accepts an element, `NodeList`, `HTMLCollection`, array, CSS selector string, HTML string (starting with `<`), a `DomSurfer` instance, or a function (registered as a `DOMContentLoaded` listener). Invalid values are filtered out; duplicates are removed. Returns `this`.

### `filter(query)`

Filters the collection in place. Pass a CSS selector string (keeps elements matching it) or a predicate `(element, index) => boolean`. Returns `this`.

### `hasOneElement()`

Returns `true` if the collection contains exactly one element.

### `assertHasOneElement()`

Asserts (via `console.assert`) that the collection has exactly one element. Returns the boolean result.

### `first()`

Returns the first raw DOM element (or `undefined`).

### `$first()`

Returns the first element wrapped in a new `DomSurfer`.

### `getAt(index)`

Returns the raw element at `index` (supports negative indices via `Array.prototype.at`).

### `$getAt(index)`

Returns the element at `index` wrapped in a new `DomSurfer`.

### `any()`

Returns `true` if the collection has at least one element.

### `none()`

Returns `true` if the collection is empty.

### `find(selector)`

Queries descendants of the single held element. Asserts exactly one element exists. Returns a new `DomSurfer`.

### `hasClass(cssClass)`

Checks whether the single held element has the class. Accepts a string or a `RegExp` (matches any class name against it). Asserts exactly one element.

### `lacksClass(cssClass)`

Inverse of `hasClass`.

### `attr(attribute)`

Returns the value of the given attribute on the first element (or `undefined`).

### `data(name)`

Returns `data-*` value for `name`, preferring `element.dataset`, falling back to the raw `data-` attribute.

### `css(value)`

- No argument: returns an object of all inline styles (`{ key: value }`).
- String: returns that style property's value.
- Object: applies each key/value as inline style (`null`/falsy removes the property).

Operates on the first element.

### `parent()`

Returns the raw `parentElement` of the first element.

### `$parent()`

Returns the parent wrapped in a new `DomSurfer`.

### `children()`

Returns the raw `children` (`HTMLCollection`) of the first element.

### `$children()`

Returns the children wrapped in a new `DomSurfer`.

### `closest(selector)`

Walks up from the first element and returns the nearest ancestor matching `selector` (or `undefined`).

### `$closest(selector)`

Returns the closest match wrapped in a new `DomSurfer`.

### `each(callback)`

Iterates over elements, calling `callback(element, index)` for each. Returns `this`.

### `$each(callback)`

Like `each`, but `callback` receives a `DomSurfer`-wrapped element: `($element, index)`.

### `append(...elements)`

Appends elements to each held element. Accepts raw nodes, `DomSurfer` instances, or iterables. Returns `this`.

### `addClass(cssClass)`

Adds a class to every element. Returns `this`.

### `removeClass(cssClass)`

Removes a class from every element. Accepts a string or a `RegExp` (removes all matching classes). Returns `this`.

### `toggleClass(cssClass)`

Toggles a class on every element. Returns `this`.

### `setClass(cssClass, booleanOrPredicate)`

Adds or removes `cssClass` based on a boolean or a predicate function `({ element, $element, e, $e }) => boolean`. Returns `this`.

### `on(eventName, callback)`

Adds an event listener for `eventName` to every element. Returns `this`.

### `onClick(callback)`

Shorthand for `on('click', callback)`.

### `onSubmit(callback)`

Shorthand for `on('submit', callback)`.

### `onLoad(callback)`

Shorthand for `on('load', callback)`.

### `show()`

Clears `display` (sets it to `null`) on every element. Returns `this`.

### `hide()`

Sets `display: none` on every element. Returns `this`.

### `innerHtml(html = null)`

Getter/setter for `innerHTML`. With no argument (or `null`), returns the first element's `innerHTML`; otherwise sets `innerHTML` on every element and returns `this`.

### `innerHTML(html = null)`

Alias of `innerHtml`.

### `innerText(text = null)`

Getter/setter for `innerText`. With no argument (or `null`), returns the first element's `innerText`; otherwise sets it on every element and returns `this`.
