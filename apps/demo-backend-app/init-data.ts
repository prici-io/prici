import PriciSdk, { FieldKind, ResetMode } from '@prici/sdk';
import * as fs from 'node:fs';
import path from 'node:path';

const sdk = new PriciSdk({
  token: process.env.PRICI_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnQiOiJkZWZhdWx0IiwiaWQiOiIxIn0.jSp5c6WCjtJ5E5c2325pWzMsaxpwDJnr6TcPcE2xTKA',
  priciUBaseUrl: 'http://0.0.0.0:9000'
});

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
        value: 3
      }
    ]
  });

  console.log('plan', plan)

  const advancedPlan = await sdk.Plan.insert({
    name: 'advanced',
    fields: [
      {
        fieldId: todosField.id,
        value: 10
      }
    ]
  });

  console.log('advancedPlan', advancedPlan)

  const account = await sdk.AccountPlan.insert({
    accountId: 'demo-account',
    plan: plan,
    resetMode: ResetMode.Manual,
  })

  console.log('account', account);

  const envs = fs.readFileSync(path.join(process.cwd(), 'example.env'), 'utf8').toString()
  fs.writeFileSync(path.join(process.cwd(), '.env'), envs.replace('PUT_HERE_FEATURE_ID', todosField.id))

})().catch(console.error)