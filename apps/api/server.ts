import fastify from 'fastify'
import { remultFastify } from 'remult/remult-fastify'
import { controllers, entities } from '../../libs/shared-remult'

(async () => {
  const server = fastify()

  await server.register(
    remultFastify({
      entities,
      controllers
    }),
  )

  const port = Number(process.env.PORT || 9000);
  await server.listen({ port })
  console.log('Listening on port ' + port)
})()