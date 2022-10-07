import * as express from 'express';
import multer from 'multer';
import { GetStorage } from '../../utility/uploader';
import { ValidateBasicAuth, LoadAuthorization, ValidateBearerToken, LoadAuthorizedUser } from '../../middlewares';
import {LoginByEmailPassword, UpdateUserName, UpdateUserPassword } from './admin.controller';
import { UpdateOrganisationInfo } from '../controller/organisation.controller';

class AdminRouting {
    public router: express.Router;
    public upload = multer({storage: GetStorage()});
    constructor(){
        this.router = express.Router();
        this.configRoutes();
    }

    private configRoutes(){
        // Authentication Routes
        this.router.get('/authentication', [...ValidateBasicAuth, ...LoadAuthorization], LoginByEmailPassword);
        this.router.put('/update-username', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], UpdateUserName);
        this.router.put('/update-password', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], UpdateUserPassword);

        // Organisation Details Routes
        this.router.put('/update-org-info', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], this.upload.single('org-details'), UpdateOrganisationInfo);
    }
}

const AdminRouter = new AdminRouting().router;
export { AdminRouter }