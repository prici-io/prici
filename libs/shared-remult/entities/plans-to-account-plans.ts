import { Entity, EntityOptions, Fields, Relations } from 'remult';
import { BaseEntity } from './types';
import { entityBaseOptions } from '../utils/entity-base-options';
import { AccountPlan } from './account-plan';
import { Plan } from './plan';

@Entity('plansToAccountPlans', {
  ...entityBaseOptions,
  id: {
    accountPlanId: true,
    planId: true
  }
}, (options: EntityOptions) => {
  if (PlansToAccountPlans.applyOptions) {
    PlansToAccountPlans.applyOptions(options);
  }
})
export class PlansToAccountPlans extends BaseEntity {
  @Fields.uuid()
  id!: string;

  @Fields.string()
  tenant: string = '';

  @Fields.string()
  accountPlanId!: string;

  @Relations.toOne(() => AccountPlan, 'accountPlanId')
  accountPlan!: AccountPlan;

  @Fields.string()
  planId!: string;

  @Relations.toOne(() => Plan, 'planId')
  plan!: Plan;

  @Fields.dateOnly()
  expireAt?: Date;

  @Fields.createdAt()
  createdAt = new Date;

  @Fields.updatedAt()
  updatedAt = new Date;
}