// lib/app.ts
import * as express from "express";
import * as bodyParser from "body-parser";
import { Router } from "./routes/Router";
import * as mongoose from "mongoose";

const packageInfo = require('../package.json');
const expressOasGenerator = require('express-oas-generator');
const REMOTEDB = process.env.REMOTE_DB || false

class App {

  public app: express.Application;
  public router: Router = new Router();
  public mongoUrl: string = this.database() + packageInfo.name + '-database';

  constructor() {
    this.app = express();
    this.config();
    this.router.routes(this.app);
    this.mongoSetup();
    this.swagger();
  }

  private database() {
    if(REMOTEDB) {
      return process.env.MONGO_DATA_BASE
    } else {
      return 'mongodb://127.0.0.1:27017/'
    }
  }

  private config(): void {
    mongoose.set('useFindAndModify', true);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise;
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  }

  private swagger() {
    if (!REMOTEDB) {
      expressOasGenerator.handleResponses(this.app);
      expressOasGenerator.handleRequests();
    }
  }

}

export default new App().app;