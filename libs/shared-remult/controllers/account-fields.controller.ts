import { BackendMethod, remult } from 'remult';
import { AccountPlan } from '../entities/account-plan';
import { FieldKind } from '../entities/plan-field';

export class AccountFieldsController {

  @BackendMethod({ allowed: true })
  async incrementField(accountId: string, fieldId: string, incrementAmount: number | any = 1): Promise<any> {
    if (typeof incrementAmount !== 'number') {
      throw new Error('increment amount must be a numeric value');
    }
    if (incrementAmount < 0) {
      throw new Error('cannot increment by a negative number')
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