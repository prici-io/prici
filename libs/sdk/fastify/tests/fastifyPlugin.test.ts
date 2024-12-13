import test, { describe } from "node:test";
import assert from "node:assert";
import Fastify from "fastify";
import { FieldKind, initialize } from "../../index";
import priciPlugin from "../index";

describe("priciPlugin", async () => {
  await describe("plugin", async () => {
    test("should register without error", async () => {
      const fastify = Fastify();
      const sdk = initialize();

      await fastify.register(priciPlugin, { sdk });
      await fastify.ready();
    });

    test("should skip when accountId and fieldId are not available", async (context) => {
      const fastify = Fastify();
      const sdk = initialize();
      const getFieldStateSpy = context.mock.fn(async () => ({
        isAllowed: true,
        state: {
          targetLimit: 1,
          kind: FieldKind.Number,
          currentValue: 0,
        },
      }));
      sdk.getFieldState = getFieldStateSpy;

      await fastify.register(priciPlugin, { sdk });

      fastify.get("/", async () => ({ test: "fastify plugin" }));

      const response = await fastify.inject({
        method: "GET",
        url: "/",
      });

      assert.strictEqual(getFieldStateSpy.mock.callCount(), 0);
      assert.strictEqual(response.statusCode, 200);
    });

    test("should use getAccountId and getFieldId from options", async (context) => {
      const fastify = Fastify();
      const sdk = initialize();
      sdk.getFieldState = context.mock.fn(async () => ({
        isAllowed: true,
        state: {
          targetLimit: 1,
          kind: FieldKind.Number,
          currentValue: 0,
        },
      }));

      const getAccountId = context.mock.fn(() => "accountId");
      const getFieldId = context.mock.fn(() => "fieldId");

      await fastify.register(priciPlugin, {
        sdk,
        getAccountId,
        getFieldId,
      });

      fastify.get("/", async () => ({ test: "fastify plugin" }));

      await fastify.inject({
        method: "GET",
        url: "/",
      });

      assert.strictEqual(getAccountId.mock.callCount(), 1);
      assert.strictEqual(getFieldId.mock.callCount(), 1);
    });

    test("should return 402 when not allowed", async (context) => {
      const fastify = Fastify();
      const sdk = initialize();
      sdk.getFieldState = context.mock.fn(async () => ({
        isAllowed: false,
        state: {
          targetLimit: 1,
          kind: FieldKind.Number,
          currentValue: 1,
        },
      }));

      await fastify.register(priciPlugin, {
        sdk,
        fieldId: "1",
        getAccountId: () => "1",
        errorMessage: "Permissions error",
      });

      fastify.get("/", async () => ({ test: "fastify plugin" }));

      const response = await fastify.inject({
        method: "GET",
        url: "/",
      });

      assert.strictEqual(response.statusCode, 402);
      assert.deepStrictEqual(JSON.parse(response.payload), {
        message: "Permissions error",
      });
    });

    test("should not call incrementField when response status code is not 2xx", async (context) => {
      const fastify = Fastify();
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

      await fastify.register(priciPlugin, {
        sdk,
        fieldId: "1",
        getAccountId: () => "1",
      });

      fastify.get("/", async () => {
        throw new Error("Test error");
      });

      await fastify.inject({
        method: "GET",
        url: "/",
      });

      assert.strictEqual(incrementFieldSpy.mock.callCount(), 0);
    });

    test("should call incrementField when response status code is 2xx", async (context) => {
      const fastify = Fastify();
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

      await fastify.register(priciPlugin, {
        sdk,
        fieldId: "1",
        getAccountId: () => "1",
      });

      fastify.get("/", async () => ({ test: "fastify plugin" }));

      await fastify.inject({
        method: "GET",
        url: "/",
      });

      assert.strictEqual(incrementFieldSpy.mock.callCount(), 1);
    });

    test("should handle incrementField error", async (context) => {
      const fastify = Fastify();
      const sdk = initialize();
      const logSpy = context.mock.fn();

      fastify.log.error = logSpy;

      sdk.getFieldState = async () => ({
        isAllowed: true,
        state: {
          targetLimit: 1,
          kind: FieldKind.Number,
          currentValue: 0,
        },
      });

      sdk.incrementField = async () => {
        throw new Error("Increment error");
      };

      await fastify.register(priciPlugin, {
        sdk,
        fieldId: "1",
        getAccountId: () => "1",
      });

      fastify.get("/", async () => ({ test: "fastify plugin" }));

      await fastify.inject({
        method: "GET",
        url: "/",
      });

      assert.strictEqual(logSpy.mock.callCount(), 1);
    });
  });
});
