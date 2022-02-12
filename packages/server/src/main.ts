import {
  createAccountHandler,
  createBoxHandler,
  createHomeHandler,
  deleteHomeHandler,
  getBoxHandler,
  getCurrentUserHandler,
  getHomeHandler,
  listBoxesHandler,
  listHomesHandler,
  loginHandler,
  logoutHandler,
  updateBoxHandler,
  updateHomeHandler,
} from '@tinybox/jsonrpc';
import express, { Request, Response } from 'express';

import { JSONRPCServer } from 'json-rpc-2.0';
import { JSONRPCServerParams } from './types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import proxy from 'express-http-proxy';
import session from 'express-session';

const app = express();
app.set('trust proxy', 1);
const rpcServer = new JSONRPCServer<JSONRPCServerParams>();

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}.`);
});

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: {
      storageEngine: 'wiredTiger',
      dbPath: './data',
    },
  });
  const uri = mongod.getUri('tinybox');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB with URI', uri);
  app.use(
    session({
      secret: 'test',
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: uri }),
      cookie: {
        secure: false,
      },
    })
  );
  app.use(express.json());
  rpcServer.addMethod('login', (params, { req }) => {
    console.log(req.session);
    req.session['auth'] = true;
  });

  rpcServer.addMethod('login', loginHandler);
  rpcServer.addMethod('createAccount', createAccountHandler);
  rpcServer.addMethod('logout', logoutHandler);
  rpcServer.addMethod('getCurrentUser', getCurrentUserHandler);
  rpcServer.addMethod('createHome', createHomeHandler);
  rpcServer.addMethod('listHomes', listHomesHandler);
  rpcServer.addMethod('getHome', getHomeHandler);
  rpcServer.addMethod('updateHome', updateHomeHandler);
  rpcServer.addMethod('deleteHome', deleteHomeHandler);
  rpcServer.addMethod('createBox', createBoxHandler);
  rpcServer.addMethod('getBox', getBoxHandler);
  rpcServer.addMethod('listBoxes', listBoxesHandler);
  rpcServer.addMethod('updateBox', updateBoxHandler);

  app.post('/jsonrpc', (req: Request, res: Response) => {
    const jsonRPCRequest = req.body;
    rpcServer.receive(jsonRPCRequest, { req }).then((jsonRPCResponse) => {
      if (jsonRPCResponse) {
        res.json(jsonRPCResponse);
      } else {
        // JSON RPC notification call (without ID field)
        res.sendStatus(204);
      }
    });
  });

  app.use(proxy('localhost:4200'));
})();
