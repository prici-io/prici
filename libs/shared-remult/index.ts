
// @ts-ignore
import { Plan } from './entities/plan';
import { PlanField } from './entities/plan-field';
import { AccountPlan } from './entities/account-plan';
import { AccountFieldsController } from './controllers/account-fields.controller';

export const entities = [Plan, PlanField, AccountPlan]

export const controllers = [AccountFieldsController]