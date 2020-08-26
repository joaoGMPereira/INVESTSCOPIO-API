// lib/app.ts
import * as express from "express";
import * as bodyParser from "body-parser";
import { Router } from "./routes/Router";
import * as mongoose from "mongoose";
import { Logger } from "tools/Logger";
const packageInfo = require('../package.json');
const expressOasGenerator = require('express-oas-generator');
const DEVELOPMENT = process.env.DEVELOPMENT_TEST || true
const DATABASE = process.env.MONGO_DATA_BASE;

class App {

  public app: express.Application;
  public router: Router = new Router();
  public mongoUrl: string = DATABASE + packageInfo.name + '-database';

  constructor() {
    this.app = express();
    this.config();
    this.router.routes(this.app);
    this.mongoSetup();
    this.swagger();
  }

  private config(): void {
    mongoose.set('useFindAndModify', true);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    console.log("DATABASE:" + DATABASE)
    console.log("DEVELOPMENT:" + DEVELOPMENT)
    console.log("URL:" + this.mongoUrl)
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise;
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  }

  private swagger() {
    if (DEVELOPMENT) {
      expressOasGenerator.handleResponses(this.app);
      expressOasGenerator.handleRequests();
    }
  }

}

export default new App().app;