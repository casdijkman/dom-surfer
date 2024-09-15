<!--
SPDX-FileCopyrightText: 2024 Cas Dijkman

SPDX-License-Identifier: GFDL-1.3-only
-->

# Dom Surfer

## About

A javascript library for selecting and operating on document object model (DOM) elements in the browser.
This library is based on the native `document.querySelectorAll()` instead of
[sizzle](https://github.com/jquery/sizzle) in the case of
[jQuery](https://github.com/jquery/jquery).

Dom Surfer is designed to be a light-weight yet powerful way to interact with DOM elements.

### Standard lines of code (SLOC) count

| Dom Surfer | jQuery | Sizzle (selector engine only) |
|------------|--------|-------------------------------|
| 208        | 6,767  | 1,539                         |

## Example

This example illustrates a simple use case for setting a class on a set of DOM elements.
Using Dom Surfer, what may take three lines of plain javascript can be a one-liner.

### Plain javascript

```javascript
document.querySelectorAll('.js').forEach((element) => {
    if (Number(element.innerText) < 20) element.classList.add('bg-red');
});
```

### Dom Surfer

```javascript
import $ from '@casd/dom-surfer';
$('.ds').setClass('bg-red', ({ e }) => Number(e.innerText) < 20);
```

## Copyright and license

Code and documentation copyright © 2024 [Cas Dijkman](https://cdijkman.nl).
Code released under the [GNU GPL version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).
Documentation released under [GNU FDL version 1.3](https://www.gnu.org/licenses/fdl-1.3.html).
Copies of the licenses can be found in the [LICENSES directory](LICENSES).

This software is distributed as free software in the hope that it will be useful, but
without any warranty; without even the implied warranty of merchantability or fitness for
a particular purpose.
