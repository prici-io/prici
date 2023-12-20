import path from 'node:path';
import { JsonDataProvider } from 'remult';

export async function getDataProvider() {
  if (process.env.POSTGRES_URL) {
    const { createPostgresDataProvider } = await import('remult/postgres')
    return createPostgresDataProvider({
      connectionString: process.env.POSTGRES_URL
    })
  }
  if (process.env.MONGODB_URL) {
    const { MongoClient } = await import('mongodb')
    const { MongoDataProvider } = await import('remult/remult-mongo')

    return async () => {
      const client = new MongoClient(process.env.MONGODB_URL as string)
      await client.connect()
      return new MongoDataProvider(client.db(process.env.MONGODB_DB_NAME || undefined), client)
    }
  }

  const { JsonEntityFileStorage } = await import('remult/server')

  return async () => {
    return new JsonDataProvider(new JsonEntityFileStorage(path.join(process.cwd(), 'db')));
  }
}