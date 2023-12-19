import { Remult } from 'remult';
import { Plan } from '../shared-remult/entities/plan';
import { PlanField } from '../shared-remult/entities/plan-field';
import { AccountPlan } from '../shared-remult/entities/account-plan';
import AccountFieldsController from '../shared-remult/controllers/account-fields.controller';
import { RequestInit } from 'node/globals';

class PriciSdk {

  #remult = new Remult();
  #accountFields = new AccountFieldsController()

  Plan = this.#remult.repo(Plan);
  PlanField = this.#remult.repo(PlanField);
  AccountPlan = this.#remult.repo(AccountPlan);

  constructor({ token }: { token?: string } = {}) {
    this.#remult.apiClient.url = 'http://0.0.0.0:9000/api'
    if (token) {
      this.#remult.apiClient.httpClient = (...args) => {
        const opts: RequestInit = args[1] || {}

        opts.headers = {
          ...opts.headers,
          Authorization: 'Bearer ' + token
        }

        args[1] = opts;
        return fetch(...args)
      }
    }
  }

  incrementField(accountId: string, fieldId: string, incrementAmount: any) {
    return this.#remult.call(this.#accountFields.incrementField, this.#accountFields, accountId, fieldId, incrementAmount)
  }

  getFieldState(accountId: string, fieldId: string) {
    return this.#remult.call(this.#accountFields.getFieldState, this.#accountFields, accountId, fieldId)
  }

}

export default PriciSdk;


