import { BackendMethod, remult } from 'remult';
import  { IAccountFieldsController } from '../../../libs/shared-remult/controllers/account-fields.controller'
import { AccountPlan } from '../../../libs/shared-remult/entities/account-plan';
import { FieldKind } from '../../../libs/shared-remult/entities/plan-field';

export class AccountFieldsController implements IAccountFieldsController {

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
  async getFieldState(accountId: string, fieldId: string) {
    const accountPlanRepo = remult.repo(AccountPlan);
    const accountPlan = await accountPlanRepo.findFirst({ accountId });

    return accountPlan.state[fieldId];
  }
}