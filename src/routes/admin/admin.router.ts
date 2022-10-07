import * as express from 'express';
import { ValidateBasicAuth, LoadAuthorization } from '../../middlewares';
import {LoginByEmailPassword } from './admin.controller';

class AdminRouting {
    public router: express.Router;
    constructor(){
        this.router = express.Router();
        this.configRoutes();
    }

    private configRoutes(){
        // Authentication Routes
        this.router.get('/authentication', [...ValidateBasicAuth, ...LoadAuthorization], LoginByEmailPassword);
    }
}

const AdminRouter = new AdminRouting().router;
export { AdminRouter }