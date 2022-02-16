import {
  createAccountHandler,
  createBoxHandler,
  createHomeHandler,
  deleteBoxHandler,
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
import MongoStore from 'connect-mongo';
import { getMongoDbUrl } from './utils/mongodb';
import mongoose from 'mongoose';
import path from 'path';
import proxy from 'express-http-proxy';
import session from 'express-session';

const app = express();
app.set('trust proxy', 1);
const rpcServer = new JSONRPCServer<JSONRPCServerParams>();

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}.`);
});

(async () => {
  const mongoUrl = await getMongoDbUrl();
  await mongoose.connect(mongoUrl);
  console.log('Connected to MongoDB.');
  app.use(
    session({
      secret: 'test',
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: mongoUrl }),
      cookie: {
        secure: false,
      },
    })
  );
  app.use(express.json());
  rpcServer.addMethod('login', (params, { req }) => {
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
  rpcServer.addMethod('deleteBox', deleteBoxHandler);

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

  if (process.env.NODE_ENV !== 'production') {
    app.use(proxy('localhost:4200'));
  } else {
    app.use(express.static(path.join(__dirname, 'web')));
    // If no match, we always server React's index.html file.
    app.use((req, res, next) => {
      res.sendFile(path.join(__dirname, 'web/index.html'));
    });
  }
})();
