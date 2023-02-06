import cloudinary from 'cloudinary';
import { Response } from "express";
import { ExtendedRequest, ResponseObject } from "../../interfaces";
import { ProductDB } from "../../models/product";

class ProductController {
    constructor() {

    }

    public static insertProduct = async (req: ExtendedRequest, res: Response) => {
        const name = req.body.name;
        const categoryId = Number(req.body.categoryId);
        const code = req.body.code;
        const description = req.body.description;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const productImage = files['productImage'];
        const productGLB = files['productGLB'];
        const createdBy = req.user.id;

        let response: ResponseObject<any>;
        let productImageId: string;
        let productImageURL: string;
        let productGLBId: string;
        let productGLBURL: string;

        try {
            if (productImage) {
                const { public_id, url } = await cloudinary.v2.uploader.upload(productImage[0].path, { folder: 'alka-industries/product-images' });
                productImageId = public_id;
                productImageURL = url;
            }
            if (productGLB) {
                const { public_id, url } = await cloudinary.v2.uploader.upload(productGLB[0].path, { folder: 'alka-industries/glbs', resource_type: 'raw' })
                productGLBId = public_id;
                productGLBURL = url;
            }
            await ProductDB.insertProduct(name, categoryId, code, description, productImageId, productImageURL, productGLBId, productGLBURL, createdBy);
            response = {
                ResponseData: null,
                ResponseMessage: 'Product Added Successfully'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updateProduct = async (req: ExtendedRequest, res: Response) => {
        const id = Number(req.params.id);
        const name = req.body.name;
        const categoryId = Number(req.body.categoryId);
        const code = req.body.code;
        const description = req.body.description;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const productImage = files['productImage'];
        const productGLB = files['productGLB'];
        const createdBy = req.user.id;

        let response: ResponseObject<any>;
        let productImageId: string;
        let productImageURL: string;
        let productGLBId: string;
        let productGLBURL: string;

        try {
            if (productImage) {
                const { public_id, url } = await cloudinary.v2.uploader.upload(productImage[0].path, { folder: 'alka-industries/product-images' });
                productImageId = public_id;
                productImageURL = url;
            }
            if (productGLB) {
                const { public_id, url } = await cloudinary.v2.uploader.upload(productGLB[0].path, { folder: 'alka-industries/glbs', resource_type: 'raw' })
                productGLBId = public_id;
                productGLBURL = url;
            }
            await ProductDB.updateProduct(id, name, categoryId, code, description, productImageId, productImageURL, productGLBId, productGLBURL);
            response = {
                ResponseData: null,
                ResponseMessage: 'Product Updated Successfully'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static getProduct = async (req: ExtendedRequest, res: Response) => {
        const pageNumber = Number(req.query.page);
        const limit = 20;
        const start = (pageNumber - 1) * limit;
        const end = pageNumber * limit;
        let response: ResponseObject<any>;
        try {
            const products = await ProductDB.getProducts(start, end);
            response = {
                ResponseData: products,
                ResponseMessage: 'Products fetched'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static getProductById = async (req: ExtendedRequest, res: Response) => {
        const id = Number(req.params.id);
        let response: ResponseObject<any>;
        try {
            const product = await ProductDB.getProductsById(id);
            response = {
                ResponseData: product,
                ResponseMessage: 'Product fetched successfully'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static getProductByCategory = async (req: ExtendedRequest, res: Response) => {
        const pageNumber = Number(req.query.page);
        const categoryId = Number(req.params.categoryId);
        const limit = 20;
        const start = (pageNumber - 1) * limit;
        const end = pageNumber * limit;
        let response: ResponseObject<any>;
        try {
            const products = await ProductDB.getProductByCategory(start, end, categoryId);
            response = {
                ResponseData: products,
                ResponseMessage: 'Products fetched'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static deleteProduct = async (req: ExtendedRequest, res: Response) => {
        const id = Number(req.query.id);
        let response: ResponseObject<any>;
        try {
            await ProductDB.deleteProductById(id);
            response = {
                ResponseData: null,
                ResponseMessage: 'Product deleted'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const InsertProduct = ProductController.insertProduct;
const UpdateProduct = ProductController.updateProduct;
const GetProducts = ProductController.getProduct;
const GetProductById = ProductController.getProductById;
const GetProductsByCategory = ProductController.getProductByCategory;
const DeleteProduct = ProductController.deleteProduct;

export {
    InsertProduct,
    UpdateProduct,
    GetProducts,
    GetProductById,
    GetProductsByCategory,
    DeleteProduct,
};

