<!--
SPDX-FileCopyrightText: 2025 Cas Dijkman

SPDX-License-Identifier: GFDL-1.3-only
-->

# `$('dom-surfer')`

[<img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" height="30" />](https://www.npmjs.com/package/@casd/dom-surfer)
[<img src="https://raw.githubusercontent.com/standard/semistandard/master/badge.svg" height="30" />](https://github.com/standard/semistandard)

<hr>
<p align="center">
    <img src="logo.jpg" alt="Dom Surfer logo" width="600">
</p>

## About

Dom Surfer is a javascript library for selecting and operating on document object model
(DOM) elements in the browser.
This library is based on the native `document.querySelectorAll()` instead of for example
[sizzle](https://github.com/jquery/sizzle) in the case of
[jQuery](https://github.com/jquery/jquery).
Dom Surfer is designed to be a light-weight yet powerful way to interact with elements on
the web easily. 🌊🏄

### Source lines of code (SLOC) comparison

| Dom Surfer | jQuery | Sizzle (selector engine only) |
|------------|--------|-------------------------------|
| 267        | 6,235  | 1,539                         |

## Example

This example illustrates a simple use case for setting a class on a set of DOM elements.
Using Dom Surfer, what may take three lines of plain javascript can be a one-liner.

### Plain javascript

```javascript
document.querySelectorAll('.js').forEach((element) => {
    if (Number(element.innerText) < 20) {
      element.classList.add('bg-red');
    }
});
```

### Dom Surfer

```javascript
import $ from '@casd/dom-surfer';
$('.ds').setClass('bg-red', ({ e }) => Number(e.innerText) < 20);
```

## API documentation

See the [API documentation file](./docs/api.md) for an overview and description of the API interface.

## Notes and (potential) caveats

- **Soft failures, no exceptions.** The library logs (`console.error` / `console.warn` / `console.assert`) but does not throw. No throw! >:)
- **Collections are static, not live.** Elements are captured and evaluated *immediately* at query time (via `querySelectorAll` etc.), so later DOM changes are not reflected. Re-query to refresh.
- **Collections aren't traceable.** There's no way to reconstruct a collection by replaying `.add()` calls — the stored elements are the result, not a record of the query.
- **Single-element methods.** `find`, `hasClass`, `attr`, `data`, `css`, `parent`, `children`, `closest` operate on `first()`. `find`/`hasClass` assume just one element.
- **Browser-only.** `isElement` depends on the global `Element`.

## Copyright and license

Code and documentation copyright © 2024 [Cas Dijkman](https://cdijkman.nl).
Code released under the [GNU GPL version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).
Copies of the licenses can be found in the [LICENSES directory](LICENSES).

This software is distributed as free software in the hope that it will be useful, but
without any warranty; without even the implied warranty of merchantability or fitness for
a particular purpose.
