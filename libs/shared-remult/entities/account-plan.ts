import { Entity, Fields, Validators } from 'remult';
import { FieldKind } from './plan-field';

export enum ResetMode {
  Manual = 'Manual',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export interface FieldState {
  targetLimit: number | string,
  kind: FieldKind,
  currentValue?: number
}

@Entity('accountPlans', {
  allowApiCrud: true
})
export class AccountPlan {
  @Fields.uuid()
  id!: string;

  @Fields.string({
    validate: Validators.required,
  })
  tenant: string = '';

  @Fields.string({
    validate: Validators.required
  })
  accountId = '';

  @Fields.uuid()
  planId?: string;

  @Fields.object()
  state: Record<string, FieldState> = {}

  @Fields.string({
    validate: (({ resetMode }: any) => {
      // @ts-ignore
      if (!ResetMode[resetMode]) {
        throw 'reset mode not valid'
      }
    })
  })
  resetMode = ResetMode.Manual

}