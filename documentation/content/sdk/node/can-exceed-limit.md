# Exceed limit of feature

In some plans, you would like to limit a feature to certain amount of items, but after that amount, you won't stop the
account to use this feature. Instead, the account will be charged for any additional usage.

### Create a plan with exceeding feature

```typescript
const advancedPlan = await sdk.PlanField.insert({
  name: 'Advanced',
  fields: [
    { fieldId: wiggleField.id, value: 10, canExceedLimit: true },
  ],
});
```

### Check state of account and feature

```typescript
const state = await sdk.getFieldState('demo-account', wiggleField.id);

// the value will be true even if the amount is more than 10 items:
if (!state.isAllowed) {
  res.send('reached limit');
}

// The account used more items than the original limitation.
if (state.hasReachedLimit) {
}
```