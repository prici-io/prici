import { remultFastify, RemultFastifyServer } from 'remult/remult-fastify';
import { getDataProvider } from './data-provider.service';
import { entitiesList } from '../entities';
import { controllers } from '../controllers';
import { defaultTenant } from '../config';

class RemultApiProviderService {
  api!: RemultFastifyServer;

  ready: Promise<RemultFastifyServer>

  constructor() {
    this.ready = new Promise((resolve, reject) => {
      this.init().then(resolve, reject)
    })
  }

  async init() {
    this.api = remultFastify({
      dataProvider: await getDataProvider(),
      entities: entitiesList,
      controllers,
      admin: process.env.ADMIN_UI === 'true',
      async getUser(req) {
        return req.user || { id: '', tenant: defaultTenant };
      }
    })
    return this.api;
  }
}

const remultApiProviderService = new RemultApiProviderService();

export default remultApiProviderService;

