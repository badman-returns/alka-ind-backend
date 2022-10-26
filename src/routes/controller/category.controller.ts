import { Response } from "express";
import { CategoryDB } from "../../models/category";
import { ExtendedRequest, ResponseObject } from "../../interfaces";

class CategoryController{
    constructor(){

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
}

const InsertCategory = CategoryController.insertCategory;

export{
    InsertCategory
}