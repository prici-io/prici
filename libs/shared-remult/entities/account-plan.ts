import { Entity, Fields, Validators } from 'remult';
import { FieldKind } from './plan-field';

export enum ResetMode {
  Manual = 'Manual',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

@Entity('accountPlans', {
  allowApiCrud: true
})
export class AccountPlan {
  @Fields.uuid()
  id!: string;

  @Fields.string({
    validate: Validators.required
  })
  accountId = '';

  @Fields.uuid()
  planId?: string;

  @Fields.object()
  state: Record<string, {targetLimit: number | string, kind: FieldKind, currentValue?: number}> = {}

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