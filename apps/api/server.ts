import fastify from 'fastify';
import { UserInfo } from 'remult';
import { host, port } from './config';
import { checkAuthPlugin } from './hooks/check-auth.plugin';
import { initEventBus } from './services/events-to-remult-provider.service';
import remultApiProviderService from './services/remult-api-provider.service';

declare module 'fastify' {
  class FastifyRequest {
    user?: UserInfo;
  }
}

(async () => {
  const server = fastify();

  await checkAuthPlugin(server);

  await server.register(
    await remultApiProviderService.ready,
  );

  await server.listen({ host, port });
  console.log(`listening on ${host}:${port}`);

  await initEventBus();
})();


if (process.env.NODE_ENV !== 'production') {
  process.on('SIGINT', () => {
    process.exit(0);
  });
}

