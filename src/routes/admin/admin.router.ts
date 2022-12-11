import * as express from 'express';
import multer from 'multer';
import { GetStorage } from '../../utility/uploader';
import { ValidateBasicAuth, LoadAuthorization, ValidateBearerToken, LoadAuthorizedUser } from '../../middlewares';
import {LoginByEmailPassword, UpdateUserName, UpdateUserPassword } from './admin.controller';
import { UpdateOrganisationInfo } from '../controller/organisation.controller';
import { UpdateAbout } from '../controller/about.controller';
import { DeleteBanner, InsertBanner } from '../controller/banner.controller';
import { DeletePartner, InsertPartner, UpdatePartner } from '../controller/partner.controller';
import { InsertCategory, UpdateCategoryById, DeleteCategoryById } from '../controller/category.controller';

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
        this.router.put('/org-info', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], this.upload.single('logo'), UpdateOrganisationInfo);

        // About Routes
        this.router.put('/about', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], UpdateAbout);

        // Banner Routes
        this.router.post('/banner', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], this.upload.single('banner'), InsertBanner);
        this.router.delete('/banner/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], DeleteBanner);

        // Partner Routes
        this.router.post('/partner', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], this.upload.single('partner'), InsertPartner);
        this.router.put('/partner/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser],this.upload.single('partner'), UpdatePartner);
        this.router.delete('/partner/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], DeletePartner);

        // Category Routes
        this.router.post('/category', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], InsertCategory);
        this.router.put('/category/:id',[...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], UpdateCategoryById);
        this.router.delete('/category/:id',[...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser],DeleteCategoryById);
    }
}

const AdminRouter = new AdminRouting().router;
export { AdminRouter }
    