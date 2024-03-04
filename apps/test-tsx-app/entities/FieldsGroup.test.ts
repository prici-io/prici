import test, { after, describe } from 'node:test';
import assert from 'node:assert';
import { getPriciSdk } from '../utils/prici-runner';
import { FieldKind } from '@prici/sdk';

describe('FieldsGroup', async () => {
  const { sdk, quit } = await getPriciSdk();

  after(() => {
    quit();
  });

  test('should be able to create a field without a group', async () => {
    const field = await sdk.PlanField.insert({
      name: 'test',
      kind: FieldKind.Number,
    });
    assert.equal(!!field.id, true);
  });

  test('should be able to create a group', async () => {
    const group = await sdk.FieldsGroup.insert({ name: 'test' });
    assert.equal(!!group.id, true);
  });

  test('should be able to create a field with group', async () => {
    const group = await sdk.FieldsGroup.insert({ name: 'test' });
    const field = await sdk.PlanField.insert({
      name: 'test',
      kind: FieldKind.Number,
      group: group,
    });
    assert.equal(!!field.id, true);
    assert.equal(!!group.id, true);
    assert.equal(field.group!.id, group.id);
  });

});