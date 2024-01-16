import fastify from 'fastify'
import { remultFastify } from 'remult/remult-fastify'
import { controllers } from './controllers';
import { UserInfo } from 'remult';
import { getDataProvider } from './services/data-provider.service';
import { host, port } from './config';
import { checkAuthPlugin } from './hooks/check-auth.plugin';
import { entitiesList } from './entities';
import { registerToEvents } from './services/event-bus-provider.service';
import { initEventBus } from './hooks/event-bus.transmitter';

declare module 'fastify' {
  class FastifyRequest {
    user?: UserInfo;
  }
}

(async () => {
  const server = fastify()

  await checkAuthPlugin(server)

  await server.register(
    remultFastify({
      dataProvider: await getDataProvider(),
      entities: entitiesList,
      controllers,
      async getUser(req) {
        return req.user || { id: '', tenant: 'default' };
      }
    }),
  )

  await server.listen({ host, port })
  console.log(`listening on ${host}:${port}`)

  await initEventBus()
})()