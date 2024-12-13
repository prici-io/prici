import { FastifyRequest, FastifyReply, FastifyPlugin } from "fastify";
import fp from "fastify-plugin";
import PriciSdk from "@prici/sdk";
import { FieldStateResult } from "@prici/shared-remult";

export interface PriciPluginOptions {
  sdk: PriciSdk;
  fieldId?: string;
  errorMessage?: string;
  incrementAmount?: number;
  getAccountId?: (req: FastifyRequest) => string | Promise<string>;
  getFieldId?: (req: FastifyRequest) => string | Promise<string>;
  getError?: (
    req: FastifyRequest,
    fieldStateResult?: FieldStateResult
  ) => string | Promise<string>;
  getIncrementAmount?: (req: FastifyRequest) => number;
}

const priciPlugin: FastifyPlugin<PriciPluginOptions> = fp<PriciPluginOptions>(
  async (fastify, options) => {
    const opts = {
      getAccountId: async (req: FastifyRequest) =>
        (req as any).accountId ||
        (req as any).account?.id ||
        (req as any).user?.account ||
        (req as any).user?.tenant,
      getFieldId: async (req: FastifyRequest) =>
        options.fieldId || (req as any).fieldId,
      getError: async (req: FastifyRequest) =>
        options.errorMessage || options.sdk.defaultErrorMessage,
      getIncrementAmount: () => options.incrementAmount,
      ...options,
    };

    fastify.addHook("onRequest", async (request, reply) => {
      const [accountId, fieldId] = await Promise.all([
        opts.getAccountId(request),
        opts.getFieldId(request),
      ]);

      if (!(accountId && fieldId)) {
        return;
      }

      const result = await opts.sdk.getFieldState(accountId, fieldId);

      if (!result.isAllowed) {
        const errorMessage = await opts.getError(request, result);
        reply.code(402).send({
          message: errorMessage,
        });
        return reply;
      }

      request.priciValues = {
        accountId,
        fieldId,
        incrementAmount: opts.getIncrementAmount(request),
      };
    });

    fastify.addHook("onResponse", async (request, reply) => {
      if (reply.statusCode.toString().startsWith("2") && request.priciValues) {
        const { accountId, fieldId, incrementAmount } = request.priciValues;

        try {
          await opts.sdk.incrementField(accountId, fieldId, incrementAmount);
        } catch (error) {
          fastify.log.error("Failed to increment field", error);
        }
      }
    });
  },
  {
    name: "fastify-prici",
  }
);

declare module "fastify" {
  interface FastifyRequest {
    priciValues?: {
      accountId: string;
      fieldId: string;
      incrementAmount?: number;
    };
  }
}

export default priciPlugin;
