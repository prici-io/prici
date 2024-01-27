# @prici/sdk

## Installation
```shell
# using npm
$ npm i @prici/sdk

# using pnpm
$ pnpm add @prici/sdk
```

## Getting Started

Create an SDK instance:

```typescript
import { initialize } from '@prici/sdk';

const sdk = initialize({
  token: process.env.PRICI_TOKEN,
  priciUBaseUrl: process.env.PRICI_BASE_URL
});
```
<br>

### Create new PlanField

A plan field is a row field inside your application pricing plans.
It can be used by all any plans, or not to be used at all.

```typescript

const jiggleField = await sdk.PlanField.insert({
  name: 'Ability to jiggle jiggle',
  kind: FieldKind.Boolean
})

const wiggleField = await sdk.PlanField.insert({
  name: 'Ability to wiggle wiggle',
  kind: FieldKind.Number
})
```
<br>

### Create new Plan

A plan field is a row field inside your application pricing plans.
It can be used by all any plans, or not to be used at all.

```typescript

const basicPlan = await sdk.Plan.insert({
  name: 'Basic',
  fields: [
    { fieldId: jiggleField.id, value: false },
    { fieldId: wiggleField.id, value: 5 },
  ]
})

const advancedPlan = await sdk.PlanField.insert({
  name: 'Advanced',
  fields: [
    { fieldId: jiggleField.id, value: true },
    { fieldId: wiggleField.id, value: 10, canExceedLimit: true },
  ]
})
```


### Create new AccountPlan

An account plan is the actual state of a plan for a specific account.
An account can have multiple plans attached.

```typescript

const demoAccount = await sdk.AccountPlan.insert({
  accountId: 'demo-account',
  planId: plan.id,
  resetMode: ResetMode.Manual,
  state: {
    [wiggleField.id]: {
      targetLimit: 20, // custom change limit
      currentValue: 4 // // custom change initial value
    }
  }
})
```