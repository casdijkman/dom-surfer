/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

class Assertion {
  constructor ({ value, description }) {
    this.value = value;
    this.descriptions = [
      ...(typeof description === 'string' ? [description] : [])
    ];

    this.be = {
      a: this._expectToBeA.bind(this),
      an: this._expectToBeA.bind(this),
      typeOf: this._expectToBeATypeOf.bind(this),
      instanceOf: this._expectToBeAnInstanceOf.bind(this)
    };

    this.to = this;
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
    this.descriptions.push(`Expected ${expected}, got ${this.value}`);
    return this.execute(() => this.value === expected);
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
      this.descriptions.push(`Expected instanceof ${expected?.name || expected}, got ${this.value}`);
      return this.value instanceof (expected);
    });
  }

  _expectToBeATypeOf (expected) {
    return this.execute(() => {
      this.descriptions.push(`Expected typeof ${expected}, got ${typeof this.value}`);
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

export function describe (description) {
  return { expect: expect.bind({ description }) };
}

export function expect (value) {
  return new Assertion({ value, description: this?.description });
}
