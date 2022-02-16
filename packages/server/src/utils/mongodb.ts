import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Get MongoDB connection URL. If MONGODB_URL env variable it set, this function
 * will simply return the value. Otherwise, it will create a standalone MongoDB
 * server locally.
 */
export async function getMongoDbUrl(): Promise<string> {
  if (process.env.MONGODB_URL) {
    return process.env.MONGODB_URL;
  } else {
    const mongod = await MongoMemoryServer.create({
      instance: {
        storageEngine: 'wiredTiger',
        dbPath: './data',
      },
    });
    const uri = mongod.getUri('tinybox');

    return uri;
  }
}
