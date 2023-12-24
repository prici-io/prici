import fastify from 'fastify'
import jwt from 'jsonwebtoken';
import { remultFastify } from 'remult/remult-fastify'
import { controllers } from './controllers';
import { UserInfo } from 'remult';
import { entities } from '@prici/shared-remult';
import { getDataProvider } from './services/data-provider.service';
import { host, jwtSecret, port } from './config';
import { checkAuthPlugin } from './hooks/check-auth.plugin';

declare module 'fastify' {
  class FastifyRequest {
    user?: UserInfo;
  }
}

(async () => {
  const server = fastify()

  await server.register(checkAuthPlugin)

  await server.register(
    remultFastify({
      dataProvider: await getDataProvider(),
      entities,
      controllers,
      async getUser(req) {
        return req.user || { id: '', tenant: 'default' };
      }
    }),
  )

  await server.listen({ host, port })
  console.log(`listening on ${host}:${port}`)
})()