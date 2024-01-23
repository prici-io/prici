import PriciSdk from '../index';
import { FieldStateResult } from '@prici/shared-remult';

export interface MiddlewareOptions {
  sdk: PriciSdk;
  fieldId?: string;
  errorMessage: string;
  incrementAmount?: number;
  getAccountId?: (req?: any) => string | Promise<string>;
  getFieldId?: (req?: any) => string | Promise<string>;
  getError?: (req?: any, fieldStateResult?: FieldStateResult) => string | Promise<string>;
  getIncrementAmount?: (req?: any) => number;
}

export function getExpressMiddleware(opts: MiddlewareOptions) {

  const options = {
    getAccountId: async (req: any) => req.accountId || req.account?.id || req.user?.account || req.user?.tenant,
    getFieldId: async (req: any) => opts.fieldId || req.fieldId,
    getError: async (req?: any) => opts.errorMessage || 'reached limit',
    getIncrementAmount: () => opts.incrementAmount,
    ...opts
  }

  return async (req: any, res: any, next: () => void) => {
    const [accountId, fieldId] = await Promise.all([
      options.getAccountId(req),
      options.getFieldId(req)
    ]);

    if (!(accountId && fieldId)) {
      next();
      return;
    }

    const result = await options.sdk.getFieldState(accountId, fieldId);

    if (!result.isAllowed) {
      res
        .status(402)
        .json({
          message: await options.getError(req, result)
        })
        .end();
      return;
    }

    res.once('finish', () => {
      if (res.statusCode.toString().startsWith('2')) {
        options.sdk
          .incrementField(accountId, fieldId, options.getIncrementAmount(req) || undefined)
          .catch()
      }
    })

    next();
  }
}