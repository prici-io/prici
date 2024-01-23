const { describe, test } = require('node:test');
const assert = require('node:assert')

describe('check import from sdk', () => {
  test('should retrieve initialize', () => {
    const sdk = require('@prici/sdk');

    assert.equal(typeof sdk.initialize, 'function')
  });
});