import { remult } from 'remult';
import { Plan } from '../shared-remult/entities/plan';
import { PlanField } from '../shared-remult/entities/plan-field';
import { AccountPlan } from '../shared-remult/entities/account-plan';
import AccountFieldsController from '../shared-remult/controllers/account-fields.controller';

remult.apiClient.url = 'http://0.0.0.0:9000/api'


export const sdk = {
  Plan: remult.repo(Plan),
  PlanField: remult.repo(PlanField),
  AccountPlan: remult.repo(AccountPlan),
  accountFields: new AccountFieldsController(),
}

export default sdk;


