# @prici/sdk

### SDK to use Prici.io API to manage pricing and SaaS plans for your application.

Go to https://prici.io for more information.

## About Prici
Prici is an open source project to manage plans and pricing for any SaaS application.

You can use the standalone service using Docker and run it locally or on your machine.

## Getting Started

Create an SDK instance:

```typescript
import PriciSdk from '@prici/sdk';

const sdk = new PriciSdk({
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
    { fieldId: wiggleField.id, value: 10 },
  ]
})
```


### Create new AccountPlan

An account plan is the actual state of a plan for a specific account

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

Enjoy.
