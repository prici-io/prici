import PriciSdk, { FieldKind, ResetMode } from '@prici/sdk';

const sdk = new PriciSdk({ token: process.env.PRICI_TOKEN });

(async () => {

  const todosField = await sdk.PlanField.insert({
    name: 'todos',
    kind: FieldKind.Number,
  })

  console.log('todosField', todosField)

  const plan = await sdk.Plan.insert({
    name: 'basic',
    fields: [
      {
        fieldId: todosField.id,
        limit: 3
      }
    ]
  });

  console.log('plan', plan)

  const advancedPlan = await sdk.Plan.insert({
    name: 'advanced',
    fields: [
      {
        fieldId: todosField.id,
        limit: 10
      }
    ]
  });

  console.log('advancedPlan', advancedPlan)

  const account = await sdk.AccountPlan.insert({
    accountId: 'demo-account',
    planId: plan.id,
    resetMode: ResetMode.Manual,
    state: {
      [todosField.id]: {
        targetLimit: 3,
        kind: FieldKind.Number,
        currentValue: 0
      }
    }
  })

  console.log('account', account)

})().catch(console.error)