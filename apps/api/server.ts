import fastify from 'fastify'
import path from 'node:path';
import jwt from 'jsonwebtoken';
import { remultFastify } from 'remult/remult-fastify'
import { entities } from '../../libs/shared-remult'
import { controllers } from './controllers';
import { JsonDataProvider, UserInfo } from 'remult';
import { JsonEntityFileStorage } from 'remult/server';

declare module 'fastify' {
  class FastifyRequest {
    user?: UserInfo;
  }
}

(async () => {
  const server = fastify()

  server.addHook('preHandler', (request, reply, done) => {
    const token = (request.headers['authorization'] || request.headers['Authorization'])?.toString().split(' ')[1] || '';

    try {
      request.user = jwt.verify(token, process.env.JWT_SECRET as string) as UserInfo;

      (request.query as any).tenant = request.user.tenant;
      if (request.body as any) {
        (request.body as any).tenant = request.user.tenant;
      }

      done()
    } catch (error) {
      reply.statusCode = 401;
      done(new Error('Authorization error: token is not valid'))
    }
  })

  await server.register(
    remultFastify({
      dataProvider: async () =>
        new JsonDataProvider(new JsonEntityFileStorage(path.join(process.cwd(), 'db'))),
      entities,
      controllers,
      async getUser(req) {
        return req.user || { id: '', tenant: 'default' };
      }
    }),
  )

  const port = Number(process.env.PORT || 9000);
  await server.listen({ host: process.env.HOST || '0.0.0.0', port })
  console.log('Listening on port ' + port)
})()