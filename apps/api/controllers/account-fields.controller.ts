import { BackendMethod, Controller, remult } from 'remult';
import BaseController from '@prici/shared-remult/controllers/account-fields.controller'
import { AccountPlan } from '@prici/shared-remult/entities/account-plan';
import { FieldKind, FieldState } from '@prici//shared-remult';

@Controller('account-fields')
export class AccountFieldsController implements BaseController {

  @BackendMethod({ allowed: true })
  async incrementField(accountId: string, fieldId: string, incrementAmount: number | any = 1): Promise<any> {
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
    accountField.currentValue += incrementAmount;

    await accountPlanRepo.update(accountPlan.id, { state: accountPlan.state });
  }

  @BackendMethod({ allowed: true })
  async getFieldState(accountId: string, fieldId: string): Promise<{ isAllowed: boolean, state?: FieldState }> {
    const accountPlanRepo = remult.repo(AccountPlan);
    const accountPlan = await accountPlanRepo.findFirst({ accountId });

    if (!accountPlan) {
      throw new Error('Account does not have any plan');
    }

    const state = accountPlan.state[fieldId];

    return {
      isAllowed: state && (
        state.kind === FieldKind.Boolean ?
          !!state.currentValue :
          (state.kind === FieldKind.Number ?
              (state.currentValue as number) < (state.targetLimit as number) :
              true
          )
      ),
      state
    };
  }
}