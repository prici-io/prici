
#  Get Field State
After you paired a plan to an account (using AccountPlan), you can check the state of any field.
This method will retrieve a calculated value you can rely on.

```typescript
const state = await sdk.getFieldState('demo-account', wiggleField.id)

if (!state.isAllowed) {
  res.send('reached limit');
}
```
