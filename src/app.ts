import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import logger from 'morgan';
import express, { NextFunction, Response, Request } from 'express';
import MasterTables from './database/createTablesAndInsertMasterData';
import { AdminRouter, PublicRouter } from './routes';
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
dotenv.config();

class App {
  public app: express.Application;
  public apiV1Routes: express.Router;

  constructor() {
    this.app = express();
    this.apiV1Routes = express.Router();
    this.initializeMiddlewares();
    this.initializeLogger();
    this.initializeErrorHandling();
    this.routes();
  }

  public cloudinaryConfig() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }

  public listen() {
    this.app.listen(process.env.SERVER_PORT, () => {
      console.log(`App listening on the port ${process.env.SERVER_PORT}`);
    });
    this.cloudinaryConfig();
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '../uploads')));
    this.app.use(express.static(path.join(__dirname, '../applications')));
    this.app.use(logger('[:date[web]] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));
  }

  private initializeErrorHandling() {

  }

  private initializeLogger() {
    const LOG_PREFIX = new Date().getDate() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    const log = console.log;
    console.log = function () {
      const args = Array.from(arguments);
      args.unshift(LOG_PREFIX + ": ");
      log.apply(console, args);
    }
  }


  public async createDefaultTables() {
    try {
      console.log(`Creating User table and Super Admin User...`);
      await MasterTables.createUserTableAndSuperAdmin();

      console.log(`Creating Organisation Table and Insert Infos...`);
      await MasterTables.createOrganisationTableAndInsertInfos(); 

      console.log(`Creating About Table...`);
      await MasterTables.createAboutTableAndInsertDefaultData();

      console.log(`Creating Banner Table...`);
      await MasterTables.createBannerTable();
   
    } catch (error) {
      throw new Error(error);
    }
  }

  private routes() {
    this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.send('Back end API, you no need to bother');
    });
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    this.app.use('/applications', express.static(path.join(__dirname, '../applications')));
    this.app.use('/api/v1', this.apiV1Routes);
    this.apiV1Routes.use("/", PublicRouter);
    this.apiV1Routes.use('/admin', AdminRouter);
  }
}

export default App;