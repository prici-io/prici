import test, { after, describe } from 'node:test';
import { getPriciSdk } from './utils/prici-runner';
import assert from 'node:assert';
import { createAccountPlan, createPlan, createPlanField } from './utils/prici-ops';

describe('getFieldState', async () => {
  const { sdk, quit } = await getPriciSdk();

  after(() => {
    quit();
  });

  test('should throw exception when account plan does not exist', async () => {
    const accountId = 'demo-account-' + Math.random();

    const field = await createPlanField(sdk);

    await assert.rejects(() => sdk.getFieldState(accountId, field.id), { message: 'Account does not have any plan' });
  });

  test('should return isAllowed = false when account plan does not include the field', async () => {
    const field = await createPlanField(sdk);
    const otherField = await createPlanField(sdk);

    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5 }]);
    const accountPlan = await createAccountPlan(sdk, plan)

    const state = await sdk.getFieldState(accountPlan.accountId, otherField.id)

    assert.equal(state.isAllowed, false)
  });

  test('should return isAllowed = true when account plan include the field and never been used', async () => {
    const field = await createPlanField(sdk);

    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5 }]);
    const accountPlan = await createAccountPlan(sdk, plan)

    const state = await sdk.getFieldState(accountPlan.accountId, field.id)

    assert.equal(state.isAllowed, true)
  });
});