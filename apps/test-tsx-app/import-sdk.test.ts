import test, { describe } from 'node:test';
import assert from 'node:assert';

describe('check import from sdk', () => {

  test('should retrieve initialize', async () => {
    const sdk = await import('@prici/sdk')

    assert.equal(typeof sdk.initialize, 'function')
  });

});