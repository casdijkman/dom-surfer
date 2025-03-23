/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

/*
   This library enables you to write simple assertions with the following syntax:

     import { describe, expect } from './expect.js';
     describe('0 is a number').expect(0).to.be.a('number');           // => true
     describe('0 is not an object').expect(0).not().to.be.an(Object); // => true
 */

class Assertion {
  constructor ({ value, description }) {
    this.value = value;
    this.descriptions = [
      ...(typeof description === 'string' ? [description] : [])
    ];

    this.to = this;
    this.be = {
      a: this._expectToBeA.bind(this),
      an: this._expectToBeA.bind(this),
      typeOf: this._expectToBeATypeOf.bind(this),
      instanceOf: this._expectToBeAnInstanceOf.bind(this)
    };
  }

  /*
     Is it possible to make this a property instead of a method? Perhaps with Proxy?
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
  */
  not () {
    this.invert = true;
    return this;
  }

  equal (expected) {
    this._addDescription({ expected });
    if ([expected, this.value].some((x) => typeof x === 'symbol')) {
      this.descriptions.push('Symbols are always unique');
    }
    return this.execute(() => this.value === expected);
  }

  _addDescription ({ type, expected, got = this.value }) {
    const typeString = type ? ` ${type}` : '';
    const expectedString = valueToStringSafe(expected);
    const gotString = valueToStringSafe(got);
    this.descriptions.push(`Expected${typeString} ${expectedString}, got ${gotString}`);
  }

  _expectToBeA (expected) {
    if (typeof expected === 'string') {
      return this._expectToBeATypeOf(expected);
    } else {
      return this._expectToBeAnInstanceOf(expected);
    }
  }

  _expectToBeAnInstanceOf (expected) {
    return this.execute(() => {
      this._addDescription({ type: 'instanceof', expected: expected?.name || expected });
      return this.value instanceof (expected);
    });
  }

  _expectToBeATypeOf (expected) {
    return this.execute(() => {
      this._addDescription({ type: 'typeof', expected });

      // eslint-disable-next-line valid-typeof
      return typeof this.value === expected;
    });
  }

  execute (predicate) {
    const result = this.invert ? !predicate() : predicate();
    const description = this.descriptions.length > 0
      ? this.descriptions.join('. ')
      : 'No description';
    console.assert(result, description);
    return Boolean(result);
  }
}

function valueToStringSafe (value) {
  if (value === '') {
    return '<empty string>';
  } else {
    const stringValue = String(value);
    console.assert(stringValue, 'could not convert value to string', value);
    return stringValue || 'unknown';
  }
}

export function describe (description) {
  return { expect: expect.bind({ description }) };
}

export function expect (value) {
  return new Assertion({ value, description: this?.description });
}
