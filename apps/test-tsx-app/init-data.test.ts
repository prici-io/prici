import test, { after, describe } from 'node:test';
import assert from 'node:assert';
import { getPriciSdk } from './utils/prici-runner';
import { FieldKind, Plan, PlanField } from '@prici/sdk';

describe('init account data using the sdk', async () => {

  const accountId = 'demo-account-' + Math.random();
  let mockField: PlanField;
  let mockPlan: Plan;
  let mockExceedingPlan: Plan;

  const { sdk, quit } = await getPriciSdk();

  after(() => {
    console.log('after tests');
    quit();
  });

  test('should get results', async () => {
    const fields = await sdk.PlanField.find({});

    assert.equal(fields instanceof Array, true);
  });


  await test('should create field', async () => {
    const data = {
      name: 'demo-field-' + Math.random(),
      kind: FieldKind.Number,
    };
    mockField = await sdk.PlanField.insert(data);

    assert.equal(!!mockField.id, true);
    assert.equal(mockField.kind, FieldKind.Number);
    assert.equal(mockField.name, data.name);
  });

  await test('should create plan', async () => {
    mockPlan = await sdk.Plan.insert({
      name: 'demo-plan-' + Math.random(),
      fields: [{
        fieldId: mockField.id,
        value: 3,
      }],
    });

    assert.equal(!!mockPlan.id, true);
    assert.deepEqual(mockPlan.fields, [{
      fieldId: mockField.id,
      value: 3,
    }]);
  });

  await test('should create plan with exceeding field', async () => {
    mockExceedingPlan = await sdk.Plan.insert({
      name: 'demo-plan-' + Math.random(),
      fields: [{
        fieldId: mockField.id,
        value: 3,
        canExceedLimit: true,
      }],
    });

    assert.equal(!!mockExceedingPlan.id, true);
    assert.deepEqual(mockExceedingPlan.fields, [{
      fieldId: mockField.id,
      value: 3,
      canExceedLimit: true,
    }]);
  });

  test('should create account plans', async () => {
    const accountPlan = await sdk.AccountPlan.insert({
      accountId,
      plan: mockPlan,
    });

    assert.equal(accountPlan.accountId, accountId);
    assert.deepEqual(accountPlan.state, {
      [mockField.id]: {
        kind: FieldKind.Number,
        targetLimit: 3,
        currentValue: 0,
      },
    });
  });

  test('should create account plan with acceding data', async () => {
    const accountPlan = await sdk.AccountPlan.insert({
      accountId,
      plan: mockExceedingPlan,
    });

    assert.equal(accountPlan.accountId, accountId);
    assert.deepEqual(accountPlan.state, {
      [mockField.id]: {
        kind: FieldKind.Number,
        targetLimit: 3,
        currentValue: 0,
        canExceedLimit: true
      },
    });
  });
});