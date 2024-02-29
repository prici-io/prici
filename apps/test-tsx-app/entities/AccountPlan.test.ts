import test, { after, describe } from 'node:test';
import assert from 'node:assert';
import { getPriciSdk } from '../utils/prici-runner';
import { createAccountPlan, createCustomAccountPlan, createPlan, createPlanField } from '../utils/prici-ops';
import { FieldKind, ResetMode } from '@prici/sdk';

describe('AccountPlan', async () => {
  const { sdk, quit } = await getPriciSdk();

  after(() => {
    quit();
  });


  test('should be created', async () => {
    const field = await createPlanField(sdk);
    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5 }]);
    const accountPlan = await createAccountPlan(sdk, plan);

    assert.equal(!!accountPlan.id, true);
  });

  test('should be created with default state', async () => {
    const field = await createPlanField(sdk);
    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5 }]);
    const accountPlan = await createAccountPlan(sdk, plan);

    assert.deepEqual(accountPlan.state, {
      [field.id]: {
        targetLimit: 5,
        kind: FieldKind.Number,
        currentValue: 0,
      },
    });
  });

  test('should be created with exceeding state', async () => {
    const field = await createPlanField(sdk);
    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5, canExceedLimit: true }]);
    const accountPlan = await createAccountPlan(sdk, plan);

    assert.deepEqual(accountPlan.state, {
      [field.id]: {
        targetLimit: 5,
        kind: FieldKind.Number,
        currentValue: 0,
        canExceedLimit: true,
      },
    });
  });

  test('should be created with default reset mode', async () => {
    const field = await createPlanField(sdk);
    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5 }]);
    const accountPlan = await createAccountPlan(sdk, plan);

    assert.equal(accountPlan.resetMode, ResetMode.Manual);
  });

  test('should be created with custom reset mode', async () => {
    const field = await createPlanField(sdk);
    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5 }]);
    const accountPlan = await createCustomAccountPlan(sdk, { resetMode: ResetMode.Monthly, plan });

    assert.equal(accountPlan.resetMode, ResetMode.Monthly);
  });

  test('should be updated', async () => {
    const field = await createPlanField(sdk);
    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5 }]);
    let accountPlan = await createCustomAccountPlan(sdk, { plan, resetMode: ResetMode.Monthly });

    assert.deepEqual(accountPlan.state, {
      [field.id]: {
        targetLimit: 5,
        kind: FieldKind.Number,
        currentValue: 0,
      },
    });
    assert.equal(accountPlan.resetMode, ResetMode.Monthly);

    accountPlan = await sdk.AccountPlan.update(accountPlan.id, { resetMode: ResetMode.Yearly });

    assert.equal(accountPlan.resetMode, ResetMode.Yearly);
  });

  test('should be able to update state', async () => {
    const field = await createPlanField(sdk);
    const plan = await createPlan(sdk, [{ fieldId: field.id, value: 5 }]);
    let accountPlan = await createCustomAccountPlan(sdk, { plan, resetMode: ResetMode.Monthly });

    assert.deepEqual(accountPlan.state, {
      [field.id]: {
        targetLimit: 5,
        kind: FieldKind.Number,
        currentValue: 0,
      },
    });

    accountPlan = await sdk.AccountPlan.update(accountPlan.id, {
      state: {
        [field.id]: {
          targetLimit: 10,
          kind: FieldKind.Number,
          currentValue: 3,
        },
      },
    });

    assert.deepEqual(accountPlan.state, {
      [field.id]: {
        targetLimit: 10,
        kind: FieldKind.Number,
        currentValue: 3,
      },
    });
  });

  test('should be able to add more fields to state', async () => {
    const field1 = await createPlanField(sdk);
    const field2 = await createPlanField(sdk);
    const plan = await createPlan(sdk, [{ fieldId: field1.id, value: 5 }]);
    let accountPlan = await createCustomAccountPlan(sdk, { plan, resetMode: ResetMode.Monthly });

    assert.deepEqual(accountPlan.state, {
      [field1.id]: {
        targetLimit: 5,
        kind: FieldKind.Number,
        currentValue: 0,
      },
    });

    accountPlan = await sdk.AccountPlan.update(accountPlan.id, {
      state: {
        [field1.id]: {
          targetLimit: 10,
          kind: FieldKind.Number,
          currentValue: 3,
        },
        [field2.id]: {
          targetLimit: 20,
          kind: FieldKind.Number,
          currentValue: 5,
        },
      },
    });

    assert.deepEqual(accountPlan.state, {
      [field1.id]: {
        targetLimit: 10,
        kind: FieldKind.Number,
        currentValue: 3,
      },
      [field2.id]: {
        targetLimit: 20,
        kind: FieldKind.Number,
        currentValue: 5,
      },
    });
  });

  test('should be able to have custom reset mode for each field', async () => {
    const field1 = await createPlanField(sdk);
    const field2 = await createPlanField(sdk);
    const plan = await createPlan(sdk, [{ fieldId: field1.id, value: 5 }]);
    let accountPlan = await createCustomAccountPlan(sdk, { plan, resetMode: ResetMode.Monthly });

    assert.equal(accountPlan.resetMode, ResetMode.Monthly);

    accountPlan = await sdk.AccountPlan.update(accountPlan.id, {
      state: {
        [field1.id]: {
          targetLimit: 10,
          kind: FieldKind.Number,
          currentValue: 3,
          resetMode: ResetMode.Yearly,
        },
        [field2.id]: {
          targetLimit: 20,
          kind: FieldKind.Number,
          currentValue: 5,
          resetMode: ResetMode.Manual,
        },
      },
    });

    assert.equal(accountPlan.resetMode, ResetMode.Monthly);
    assert.deepEqual(accountPlan.state, {
      [field1.id]: {
        targetLimit: 10,
        kind: FieldKind.Number,
        currentValue: 3,
        resetMode: ResetMode.Yearly,
      },
      [field2.id]: {
        targetLimit: 20,
        kind: FieldKind.Number,
        currentValue: 5,
        resetMode: ResetMode.Manual,
      },
    });
  });

  test('should inherit custom reset mode from plan for each field', async () => {
    const field1 = await createPlanField(sdk);
    const field2 = await createPlanField(sdk);
    const plan = await createPlan(sdk, [
      { fieldId: field1.id, value: 5, resetMode: ResetMode.Manual },
      { fieldId: field2.id, value: 5, resetMode: ResetMode.Yearly },
    ]);
    const accountPlan = await createCustomAccountPlan(sdk, { plan, resetMode: ResetMode.Monthly });

    assert.equal(accountPlan.resetMode, ResetMode.Monthly);
    assert.deepEqual(accountPlan.state, {
      [field1.id]: {
        targetLimit: 5,
        kind: FieldKind.Number,
        currentValue: 0,
        resetMode: ResetMode.Manual,
      },
      [field2.id]: {
        targetLimit: 5,
        kind: FieldKind.Number,
        currentValue: 0,
        resetMode: ResetMode.Yearly,
      },
    });
  });
});