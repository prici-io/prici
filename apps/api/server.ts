import fastify from 'fastify'
import path from 'node:path';
import { remultFastify } from 'remult/remult-fastify'
import { entities } from '../../libs/shared-remult'
import { controllers } from './controllers';
import { JsonDataProvider } from 'remult';
import { JsonEntityFileStorage } from 'remult/server';

(async () => {
  const server = fastify()

  await server.register(
    remultFastify({
      dataProvider: async () =>
        new JsonDataProvider(new JsonEntityFileStorage(path.join(process.cwd(), 'db'))),
      entities,
      controllers,
    }),
  )

  const port = Number(process.env.PORT || 9000);
  await server.listen({ host: '0.0.0.0', port })
  console.log('Listening on port ' + port)
})()