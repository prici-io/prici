import { BackendMethod } from 'remult';
import { FieldState } from '../entities/account-plan';
import { FieldKind } from '../entities/plan-field';

export interface IAccountFieldsController {
  incrementField: (accountId: string, fieldId: string, incrementAmount: number | any) => Promise<any>
  getFieldState: (accountId: string, fieldId: string) => Promise<any>
}

export default class AccountFieldsController implements IAccountFieldsController {

  @BackendMethod({ allowed: true })
  async incrementField(accountId: string, fieldId: string, incrementAmount: number | any = 1): Promise<any> {
    return;
  }

  @BackendMethod({ allowed: true })
  async getFieldState(accountId: string, fieldId: string): Promise<FieldState> {
    return {
      targetLimit: 1,
      kind: FieldKind.Number,
      currentValue: 0,
    }
  }
}