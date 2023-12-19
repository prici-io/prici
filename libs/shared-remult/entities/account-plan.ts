import { Entity, Fields, Relations, remult, Validators } from 'remult';
import { FieldState, ResetMode } from './types';
import { entityBaseOptions } from '../utils/entity-base-options';
import { Plan } from './plan';

const ResetModes = new Set(Object.values(ResetMode))

@Entity('accountPlans', entityBaseOptions)
export class AccountPlan {
  @Fields.uuid()
  id!: string;

  @Fields.string()
  tenant: string = '';

  @Fields.string({
    validate: Validators.required
  })
  accountId = '';

  @Relations.toOne(() => Plan)
  planId?: string;

  @Fields.object()
  state: Record<string, FieldState> = {}

  @Fields.string({
    validate: (({ resetMode }: any) => {
      // @ts-ignore
      if (!ResetModes.has(resetMode)) {
        throw 'reset mode not valid'
      }
    })
  })
  resetMode = ResetMode.Manual

}