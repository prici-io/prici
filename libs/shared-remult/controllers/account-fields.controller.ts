import { BackendMethod, Controller } from 'remult';
import { FieldState } from '../entities/account-plan';
import { FieldKind } from '../entities/plan-field';

@Controller('account-fields')
export default class AccountFieldsController {

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