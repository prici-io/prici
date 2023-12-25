import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';
import { UserInfo } from 'remult';

export async function checkAuthPlugin(server: FastifyInstance) {
  server.addHook('preHandler', (request, reply, done) => {
    const token = (request.headers['authorization'] || request.headers['Authorization'])?.toString().split(' ')[1] || '';

    try {
      request.user = jwt.verify(token, jwtSecret) as UserInfo;

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
}