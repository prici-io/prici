import { CalculatedFieldState } from '../entities/types';

export interface IncrementFieldEvent {
  type: 'incrementField';
  accountId: string;
  fieldId: string;
  incrementAmount?: number | any;
  tenant?: string;
}

export interface FieldStateResult {
  isAllowed: boolean,
  hasReachedLimit?: boolean,
  state?: CalculatedFieldState
}
