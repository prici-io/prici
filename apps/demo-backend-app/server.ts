import fastify from 'fastify'
// @ts-ignore
import sdk from '../../libs/sdk';
import { FieldKind } from '../../libs/shared-remult/entities/plan-field';
import { ResetMode } from '../../libs/shared-remult/entities/account-plan';


(async () => {

  const todosField = await sdk.PlanField.insert({
    name: 'todos',
    kind: FieldKind.Number,
  })

  const plan = await sdk.Plan.insert({
    name: 'basic',
    fields: [
      {
        fieldId: todosField.id,
        limit: 3
      }
    ]
  });
  const advancedPlan = await sdk.Plan.insert({
    name: 'advanced',
    fields: [
      {
        fieldId: todosField.id,
        limit: 10
      }
    ]
  });

  await sdk.AccountPlan.insert({
    accountId: 'demo-account',
    plan: plan.id,
    resetMode: ResetMode.Manual,
    state: {
      [todosField.id]: {
        targetLimit: 3,
        kind: FieldKind.Number,
        currentValue: 0
      }
    }
  })

  const server = fastify()

  const todos: any[] = [];

  server.get('/api/todos', () => {
    return todos;
  })

  server.post('/api/todos', async (req: any) => {
    const todo = req.body || {};

    const state = await sdk.accountFields.getFieldState('demo-account', todosField.id)



    todo.id = btoa(Math.random().toString());

    todos.push(todo);

    return todo;
  })

  const port = Number(process.env.PORT || 4000);
  await server.listen({ port })
  console.log('Demo Backend App listening on port ' + port)
})()