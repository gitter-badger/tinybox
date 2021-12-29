import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export interface HermeticServer {
  shutdown: () => Promise<void>;
}

export async function startHermeticServer(): Promise<HermeticServer> {
  const mongod = await MongoMemoryServer.create();

  await mongoose.connect(mongod.getUri());

  return {
    shutdown: async () => {
      await mongoose.connection.close();
      await mongod.stop();
    },
  };
}
