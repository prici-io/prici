import fastify from 'fastify'
import { initialize } from '@prici/sdk';
import { Kafka } from 'kafkajs';


const kafka = new Kafka({
  clientId: 'demo-backend-app',
  brokers: ['localhost:9092']
})

const kafkaProducer = kafka.producer();
kafkaProducer.connect()

const sdk = initialize({
  kafka: {
    producer: kafkaProducer,
    topic: 'prici-incoming'
  }
});

const featureId = process.env.TODOS_FEATURE_ID as string;

(async () => {
  const server = fastify()
  const todos: any[] = [];

  server.get('/api/todos', () => {
    return todos;
  })

  server.post('/api/todos', async (req: any, reply) => {
    const state = await sdk.getFieldState('demo-account', featureId)

    if (!state.isAllowed) {
      reply.statusCode = 400;
      return {
        message: 'limit reached'
      }
    }

    const todo = req.body || {};
    todo.id = btoa(Math.random().toString());

    todos.push(todo);

    sdk.kafka.incrementField({
      tenant: 'default',
      accountId: 'demo-account',
      fieldId: featureId,
    });

    return todo;
  })

  const port = Number(process.env.PORT || 4000);
  await server.listen({ port })
  console.log('Demo Backend App listening on port ' + port)
})()