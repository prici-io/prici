import { entities } from '@prici/shared-remult';
import { applyOptionsForAccountPlan } from './account-plan';

entities.AccountPlan.applyOptions = applyOptionsForAccountPlan;

export const entitiesList = Object.values(entities);