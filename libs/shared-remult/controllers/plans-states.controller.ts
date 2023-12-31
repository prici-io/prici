import { BackendMethod, Controller } from 'remult';
import { AccountPlan } from '../entities/account-plan';

export type AssociatedPlanForAccount = string | {
  planId: string;
  expireAt?: Date;
}


export interface IAttachPlanOptions {
  accountId: string;
  planId: string;
  expireAt?: Date;
}

@Controller('plans-states')
export default class PlansStatesController {
  @BackendMethod({ allowed: true })
  async generateAccountPlan(account: AccountPlan & { plans: AssociatedPlanForAccount[] }): Promise<AccountPlan> {
    return account;
  }

  @BackendMethod({ allowed: true })
  async attachPlanToAccount(options: IAttachPlanOptions): Promise<void> {
    return;
  }
}