import { Response } from "express";
import { CategoryDB } from "../../models/category";
import { ExtendedRequest, ResponseObject } from "../../interfaces";

class CategoryController{
    constructor(){

    }

    public static getCategories = async(req:ExtendedRequest, res: Response) => {
        let response: ResponseObject<any>;
        try {
            const categories = await CategoryDB.getAllCategories();
            response = {
                ResponseData: categories,
                ResponseMessage: 'Categories fetched',
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static getCategoryById = async(req: ExtendedRequest, res: Response) => {
        const id= Number(req.params.id);

        let response: ResponseObject<any>;

        try{
            const categoty= await CategoryDB.getCategoryById(id);
            response = {
                ResponseData: categoty,
                ResponseMessage: 'Category fetched',
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static insertCategory = async(req: ExtendedRequest, res: Response) => {
        const name = req.body.name;
        const createdBy = req.user.id;

        let response: ResponseObject<any>;
        try {
            await CategoryDB.insertCategory(name, createdBy);
            response = {
                ResponseData: null,
                ResponseMessage: 'Category Added.'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updateCategoryById= async(req: ExtendedRequest, res: Response) =>{
        const id=req.params.id;
        const name=req.body.name;

        let response: ResponseObject<any>;

        try{
            await CategoryDB.updateCategoryById(id, name);
            response = {
                ResponseData: null,
                ResponseMessage: 'Category updated',
            }
        }catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static deleteCategoryById= async(req: ExtendedRequest, res: Response) =>{
        const id = Number(req.params.id);

        let response: ResponseObject<any>;

        try{
            await CategoryDB.deleteCategoryById(id);
            response = {
                ResponseData: null,
                ResponseMessage: 'Category deleted.'
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const GetCategories= CategoryController.getCategories;
const GetCategoryById= CategoryController.getCategoryById;
const InsertCategory = CategoryController.insertCategory;
const UpdateCategoryById= CategoryController.updateCategoryById;
const DeleteCategoryById= CategoryController.deleteCategoryById;

export{
    InsertCategory,
    UpdateCategoryById,
    DeleteCategoryById,
    GetCategories,
    GetCategoryById,
}