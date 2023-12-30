import { Entity, EntityOptions, Fields, Relations, Validators } from 'remult';
import { BaseEntity, FieldState, ResetMode } from './types';
import { entityBaseOptions } from '../utils/entity-base-options';
import { Plan } from './plan';

const ResetModes = new Set(Object.values(ResetMode))

@Entity('accountPlans', entityBaseOptions, (options: EntityOptions) => {
  if (AccountPlan.applyOptions) {
    AccountPlan.applyOptions(options);
  }
})
export class AccountPlan extends BaseEntity {
  @Fields.uuid()
  id!: string;

  @Fields.string()
  tenant: string = '';

  @Fields.string({
    validate: Validators.required
  })
  accountId = '';

  @Relations.toOne(() => Plan, { dbName: 'planId' })
  plan?: Plan;

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

  @Fields.createdAt()
  createdAt = new Date;

  @Fields.updatedAt()
  updatedAt = new Date;
}