import { BackendMethod, Controller, remult } from 'remult';
import BaseController from '@prici/shared-remult/controllers/account-fields.controller'
import { AccountPlan } from '@prici/shared-remult/entities/account-plan';
import { FieldKind, FieldState } from '@prici//shared-remult';

@Controller('account-fields')
export class AccountFieldsController implements BaseController {

  @BackendMethod({ allowed: true })
  async incrementField(accountId: string, fieldId: string, incrementAmount: number | any = 1): Promise<any> {
    incrementAmount = incrementAmount || 1;
    if (typeof incrementAmount !== 'number' || isNaN(incrementAmount)) {
      throw new Error('increment amount must be a numeric value');
    }

    const accountPlanRepo = remult.repo(AccountPlan);
    const accountPlan = await accountPlanRepo.findFirst({ accountId });

    const accountField = accountPlan.state[fieldId];

    if (accountField.kind !== FieldKind.Number) {
      throw new Error('cannot increment not numeric field')
    }

    if (!accountField.currentValue) {
      accountField.currentValue = 0;
    }
    accountField.currentValue = (accountField.currentValue as number) + incrementAmount;

    await accountPlanRepo.update(accountPlan.id, { state: accountPlan.state });
  }

  @BackendMethod({ allowed: true })
  async getFieldState(accountId: string, fieldId: string, allowedValue?: number | string): Promise<{ isAllowed: boolean, state?: FieldState }> {
    const accountPlanRepo = remult.repo(AccountPlan);
    const accountPlan = await accountPlanRepo.findFirst({ accountId });

    if (!accountPlan) {
      throw new Error('Account does not have any plan');
    }

    const state = accountPlan.state[fieldId];

    let isAllowed = false;

    switch (state.kind) {
      case FieldKind.Boolean:
        isAllowed = !!state.currentValue;
        break;
      case FieldKind.Number:
        const diff = Number(state.targetLimit) - Number(state.currentValue);
        isAllowed = diff > 0 && (!allowedValue || diff >= Number(allowedValue))
        break;
      case FieldKind.String:
        isAllowed = typeof allowedValue === 'undefined' ? true : state.currentValue === allowedValue;
        break;
    }

    return {
      isAllowed,
      state
    };
  }
}