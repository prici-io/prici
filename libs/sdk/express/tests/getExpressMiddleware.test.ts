import test, { describe } from 'node:test';
import assert from 'node:assert';
import { getExpressMiddleware } from '../index';
import { FieldKind, initialize } from '../../index';

describe('getExpressMiddleware', async () => {

  test('should be a function', async () => {

    assert.equal(typeof getExpressMiddleware, 'function');
  });

  test('should return a function', async () => {
    const sdk = initialize();
    const middleware = getExpressMiddleware({ sdk });
    assert.equal(typeof middleware, 'function');
  });

  await describe('middleware', async () => {
    test('should call next when accountId and fieldId are not available', async (context) => {
      const sdk = initialize();
      const middleware = getExpressMiddleware({ sdk });
      const req = {};
      const res = {};
      const next = () => {
      };
      const spy = context.mock.fn();
      await middleware(req, res, spy);

      assert.strictEqual(spy.mock.callCount(), 1);
    });

    test('should use getAccountId and getFieldId from options', async (context) => {
      const sdk = initialize();
      sdk.getFieldState = context.mock.fn(async () => ({
        isAllowed: true, state: {
          targetLimit: 1,
          kind: FieldKind.Number,
          currentValue: 0,
        },
      }));
      const getAccountId = context.mock.fn(() => 'accountId');
      const getFieldId = context.mock.fn(() => 'fieldId');
      const middleware = getExpressMiddleware({ sdk, getAccountId, getFieldId });
      const req = {};
      const res = { once: context.mock.fn() };
      const spy = context.mock.fn();
      await middleware(req, res, spy);

      assert.strictEqual(getAccountId.mock.callCount(), 1);
      assert.strictEqual(getFieldId.mock.callCount(), 1);
    });

    // more tests
    test('should not call incrementField when response status code is not 2xx', async (context) => {
      const sdk = initialize();
      sdk.getFieldState = context.mock.fn(async () => ({
        isAllowed: true, state: {
          targetLimit: 1,
          kind: FieldKind.Number,
          currentValue: 0,
        },
      }));
      const incrementFieldSpy = context.mock.fn(async () => ({}));
      sdk.incrementField = incrementFieldSpy;
      const middleware = getExpressMiddleware({ sdk, fieldId: '1', getAccountId: () => '1'});
      const req = {};
      const res = { once: context.mock.fn(), statusCode: 400 };
      const spy = context.mock.fn();
      await middleware(req, res, spy);

      assert.strictEqual(incrementFieldSpy.mock.callCount(), 0);
    });

    test('should call incrementField when response status code is 2xx', async (context) => {
      const sdk = initialize();
      sdk.getFieldState = context.mock.fn(async () => ({
        isAllowed: true,
        state: {
          targetLimit: 1,
          kind: FieldKind.Number,
          currentValue: 0,
        },
      }));
      const incrementFieldSpy = context.mock.fn(async () => ({}));
      sdk.incrementField = incrementFieldSpy;
      const middleware = getExpressMiddleware({ sdk, fieldId: '1', getAccountId: () => '1'});
      const req = {};
      let callback;
      const res = { once: context.mock.fn((a, b) => callback = b), statusCode: 200 };
      const spy = context.mock.fn();
      await middleware(req, res, spy);

      // @ts-ignore
      callback();

      assert.strictEqual(incrementFieldSpy.mock.callCount(), 1);
    });
  });

});