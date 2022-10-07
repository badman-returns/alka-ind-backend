import * as express from 'express';
import { ValidateBasicAuth, LoadAuthorization, ValidateBearerToken, LoadAuthorizedUser } from '../../middlewares';
import {LoginByEmailPassword, UpdateUserName, UpdateUserPassword } from './admin.controller';

class AdminRouting {
    public router: express.Router;
    constructor(){
        this.router = express.Router();
        this.configRoutes();
    }

    private configRoutes(){
        // Authentication Routes
        this.router.get('/authentication', [...ValidateBasicAuth, ...LoadAuthorization], LoginByEmailPassword);
        this.router.put('/update-username', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], UpdateUserName);
        this.router.put('/update-password', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], UpdateUserPassword);
    }
}

const AdminRouter = new AdminRouting().router;
export { AdminRouter }