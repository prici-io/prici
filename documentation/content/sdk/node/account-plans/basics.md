
#  Account Plans
The account plans are the entities that represent the state of a plan for a specific account.
An account can have multiple plans attached.


## Create new AccountPlan
```typescript
const demoAccount = await sdk.AccountPlan.insert({
  accountId: 'custom account id',
})
```

##  Create new AccountPlan with an attached plan

```typescript
const demoAccount = await sdk.AccountPlan.insert({
  accountId: 'demo-account',
  planId: plan.id,
  resetMode: ResetMode.Manual, // by default it's set to ResetMode.Manual
})
```


##  Create new AccountPlan with a custom state

```typescript
const demoAccount = await sdk.AccountPlan.insert({
  accountId: 'demo-account',
  planId: plan.id,
  resetMode: ResetMode.Manual, // by default it's set to ResetMode.Manual,
  // will override the default values of the given plan
  state: {
    [jiggleField.id]: {
      targetLimit: 5,
    },
    [wiggleField.id]: {
      targetLimit: 10,
    },
  }
})
```
