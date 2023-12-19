import fastify from 'fastify'
// @ts-ignore
import PriciSdk from '../../libs/sdk';

const sdk = new PriciSdk();

(async () => {

  const server = fastify()

  const todos: any[] = [];

  server.get('/api/todos', () => {
    return todos;
  })

  server.post('/api/todos', async (req: any, reply) => {
    const state = await sdk.getFieldState('demo-account', 'a')

    if (!state.isAllowed) {
      reply.statusCode = 400;
      return {
        message: 'limit reached'
      }
    }

    const todo = req.body || {};
    todo.id = btoa(Math.random().toString());

    todos.push(todo);

    sdk.incrementField('demo-account', process.env.TODOS_FEATURE_ID).catch()

    return todo;
  })

  const port = Number(process.env.PORT || 4000);
  await server.listen({ port })
  console.log('Demo Backend App listening on port ' + port)
})()