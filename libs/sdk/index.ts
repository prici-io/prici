import { Remult } from 'remult';
import {
  Plan,
  PlanField,
  AccountPlan,
  IncrementFieldEvent,
  AccountFieldsController,
  FieldKind,
  ResetMode,
  FieldState,
  FieldInPlan,
} from '@prici/shared-remult';

export interface PriciSdkOptions {
  token?: string;
  priciUBaseUrl?: string;
  defaultErrorMessage?: string;
  kafka?: {
    producer: any;
    topic: string;
  };
}

export class PriciSdk {
  #remult = new Remult();
  #accountFields = new AccountFieldsController();

  kafkaOptions?: PriciSdkOptions['kafka'];
  readonly defaultErrorMessage: string;

  Plan = this.#remult.repo(Plan);
  PlanField = this.#remult.repo(PlanField);
  AccountPlan = this.#remult.repo(AccountPlan);

  constructor({
    token,
    priciUBaseUrl,
    kafka,
    defaultErrorMessage,
  }: PriciSdkOptions = {}) {
    token = token || process.env.PRICI_TOKEN;
    priciUBaseUrl = priciUBaseUrl || process.env.PRICI_BASE_URL;
    this.kafkaOptions = kafka;
    this.defaultErrorMessage = defaultErrorMessage || 'payment required';
    this.#remult.apiClient.url = priciUBaseUrl + '/api';

    if (token) {
      this.#remult.apiClient.httpClient = (...args) => {
        const opts: RequestInit = args[1] || {};

        opts.headers = {
          ...opts.headers,
          Authorization: 'Bearer ' + token,
        };

        args[1] = opts;
        const reqUrl = args[0];
        const reqInit = args[1];
        return fetch(reqUrl, reqInit);
      };
    }
  }

  incrementField(
    accountId: string,
    fieldId: string,
    incrementAmount?: number | any
  ) {
    return this.#remult.call(
      this.#accountFields.incrementField,
      this.#accountFields,
      accountId,
      fieldId,
      incrementAmount
    );
  }

  getFieldState(
    accountId: string,
    fieldId: string,
    allowedValue?: number | string
  ) {
    return this.#remult.call(
      this.#accountFields.getFieldState,
      this.#accountFields,
      accountId,
      fieldId,
      allowedValue
    );
  }

  kafka = {
    incrementField: (options: Omit<IncrementFieldEvent, 'type'>) => {
      if (!this.kafkaOptions) {
        throw new Error('kafka options not initialized');
      }
      this.kafkaOptions.producer.send({
        topic: this.kafkaOptions.topic,
        messages: [
          { value: JSON.stringify({ type: 'incrementField', ...options }) },
        ],
      });
    },
  };
}

export const initialize = (opts: PriciSdkOptions = {}) => {
  return new PriciSdk(opts) as PriciSdk;
};

export default PriciSdk;

export {
  Plan,
  PlanField,
  AccountPlan,
  FieldKind,
  ResetMode,
  FieldState,
  FieldInPlan,
};
