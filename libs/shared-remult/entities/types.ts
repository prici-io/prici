declare module 'remult' {
  export interface UserInfo {
    tenant: string;
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
  targetLimit: number | string,
  kind: FieldKind,
  currentValue?: number
}

export interface FieldInPlan {
  fieldId: string,
  limit: number | boolean | string
}
