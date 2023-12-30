import { BackendMethod, Controller } from 'remult';
import { FieldKind, FieldState } from '../entities/types';

export interface FieldStateResult {
  isAllowed: boolean,
  state?: FieldState
}

@Controller('account-fields')
export default class AccountFieldsController {

  @BackendMethod({ allowed: true })
  async incrementField(accountId: string, fieldId: string, incrementAmount: number | any = 1): Promise<any> {
    return;
  }

  @BackendMethod({ allowed: true })
  async getFieldState(accountId: string, fieldId: string, allowedValue?: number | string): Promise<FieldStateResult> {
    return {
      isAllowed: true,
      state: {
        targetLimit: 1,
        kind: FieldKind.Number,
        currentValue: 0,
      }
    }
  }
}