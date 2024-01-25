import { EntityOptions } from 'remult';

declare module 'remult' {
  export interface UserInfo {
    tenant: string;
  }
}

export class BaseEntity {
  static applyOptions(options: EntityOptions): void {

  }
}

export enum FieldKind {
  Boolean = 'boolean',
  Number = 'number',
  String = 'string'
}

export enum ResetMode {
  Manual = 'Manual',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export interface FieldState {
  targetLimit: number | string | boolean,
  kind: FieldKind,
  currentValue?: number | string | boolean,
  canExceedLimit?: boolean
}

export interface CalculatedFieldState {
  targetLimit: number | string | boolean,
  kind: FieldKind,
  currentValue?: number | string[] | boolean,
  canExceedLimit?: boolean
}

export interface FieldInPlan {
  fieldId: string,
  value: number | boolean | string,
  canExceedLimit?: boolean
}
