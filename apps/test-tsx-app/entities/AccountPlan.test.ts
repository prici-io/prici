import test, { after, describe } from 'node:test';
import assert from 'node:assert';
import { getPriciSdk } from '../utils/prici-runner';
import { createAccountPlan, createPlan, createPlanField } from '../utils/prici-ops';

describe('AccountPlan', async () => {
  const accountId = 'demo-account-' + Math.random();
  const { sdk, quit } = await getPriciSdk();

  after(() => {
    quit();
  });


  test('should be created', async () => {
    const field = await createPlanField(sdk);
    const otherField = await createPlanField(sdk);

    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5 }]);
    const accountPlan = await createAccountPlan(sdk, plan)

    assert.equal(!!accountPlan.id, true);
  });
});