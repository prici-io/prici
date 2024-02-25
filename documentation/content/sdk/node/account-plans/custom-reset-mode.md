
#  Custom Reset Modes for Fields
In some cases, there is a reset mode of a field that is not aligned with a plan reset mode.

For example: The amount of CI minutes on GitHub Actions is reset every month, but the size of storage (In MBs) can never by reset without clearing the actual storage.

In this case, you can set a custom reset mode for a field.

###  1. Create new PlanField
```typescript
const artifactsStorage = await sdk.PlanField.insert({
  name: 'Artifacts storage',
  kind: FieldKind.Number,
  resetMode: ResetMode.Manual,
})
```

### 2. Create new Plan
```typescript
const basicPlan = await sdk.Plan.insert({
  name: 'Basic',
  fields: [
    { fieldId: artifactsStorage.id, value: 100 },
  ]
})
```


### 3. Create new AccountPlan

The account plan will have an initial state of the plan's fields.
The `artifactsStorage` field will automatically have a custom reset mode of `ResetMode.Manual`.

```typescript
const demoAccount = await sdk.AccountPlan.insert({
  accountId,
  planId: basicPlan.id,
  resetMode: ResetMode.Monthly,
});

console.log(demoAccount); /*
 { id: '...', accountId: '...', planId: '...',
  resetMode: 'Monthly',
   state: { 
     [artifactsStorage.id]: { 
      currentValue: 0, 
      targetLimit: 100,
      kind: 'number',
      resetMode: 'Manual'   <---- Custom reset mode
     }
   }
  }
 */
```