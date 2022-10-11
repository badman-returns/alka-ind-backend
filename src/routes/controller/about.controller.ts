import { Response } from "express";
import { AboutDB } from "../../models/about";
import { ExtendedRequest, ResponseObject } from "../../interfaces";

class AboutController{
    constructor(){

    }

    public static getAbout = async(req:ExtendedRequest, res: Response) => {
        let response: ResponseObject<any>;
        try{
            const about = await AboutDB.getAbout();
            response = {
                ResponseData: about,
                ResponseMessage: 'About Fetched',
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updateAbout = async(req:ExtendedRequest, res: Response) => {
        const content = req.body.content;

        let response: ResponseObject<any>;

        try{
            await AboutDB.updateAbout(content);
            response = {
                ResponseData: null,
                ResponseMessage: 'About updated',
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const GetAbout = AboutController.getAbout;
const UpdateAbout = AboutController.updateAbout;

export {
    GetAbout,
    UpdateAbout,
}