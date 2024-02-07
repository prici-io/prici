import { FieldInPlan, FieldKind, Plan, PriciSdk } from '@prici/sdk';

export function createPlanField(sdk: PriciSdk, kind: FieldKind = FieldKind.Number) {
  const data = {
    name: 'demo-field-' + Math.random(),
    kind,
  };
  return sdk.PlanField.insert(data);
}

export function createPlan(sdk: PriciSdk, fields: FieldInPlan[]) {
  return sdk.Plan.insert({
    name: 'demo-plan-' + Math.random(),
    fields,
  });
}

export function createAccountPlan(sdk: PriciSdk, mockPlan: Plan, accountId: string = 'demo-account-' + Math.random()) {
  return sdk.AccountPlan.insert({
    accountId,
    plan: mockPlan,
  });
}
