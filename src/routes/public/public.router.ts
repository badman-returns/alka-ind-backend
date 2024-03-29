import * as express from 'express';
import multer from 'multer';
import { GetStorage } from '../../utility/uploader';
import { GetAbout } from '../controller/about.controller';
import { GetAllBanners, GetBannerById } from '../controller/banner.controller';
import { GetCategories, GetCategoryById } from '../controller/category.controller';
import { GetOrganisationInfo } from '../controller/organisation.controller';
import { GetPartnerById, GetPartners } from '../controller/partner.controller';
import { GetProductById, GetProducts, GetProductsByCategory } from '../controller/product.controller';

class PublicRouting {
    public router: express.Router;
    public upload = multer({ storage: GetStorage() });
    constructor() {
        this.router = express.Router();
        this.configRoutes();
    }

    private configRoutes() {

        // Organisation Details Routes
        this.router.get('/org-info', GetOrganisationInfo);

        // About Routes
        this.router.get('/about', GetAbout);

        // Banner Routes
        this.router.get('/banners', GetAllBanners);
        this.router.get('/banner/:id', GetBannerById);

        // Partner Routes
        this.router.get('/partners', GetPartners);
        this.router.get('/partner/:id', GetPartnerById);

        // Category Routes
        this.router.get('/categories', GetCategories);
        this.router.get('/category/:id', GetCategoryById);

        // Product Routes
        this.router.get('/products', GetProducts);
        this.router.get('/product/:id', GetProductById);
        this.router.get('/products/:categoryId', GetProductsByCategory);
    }
}

const PublicRouter = new PublicRouting().router;
export { PublicRouter };

