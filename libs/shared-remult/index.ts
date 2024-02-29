// @ts-ignore
import { Plan } from './entities/plan';
import { PlanField } from './entities/plan-field';
import { AccountPlan } from './entities/account-plan';
import { FieldsGroup } from './entities/fields-group';
import AccountFieldsController from './controllers/account-fields.controller';

export * from './entities/types';
export * from './controllers/types';

export const entities = { Plan, PlanField, AccountPlan, FieldsGroup };

export const controllers = [AccountFieldsController];

export {
  AccountFieldsController,
  Plan, PlanField, AccountPlan, FieldsGroup,
};