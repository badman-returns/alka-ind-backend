import { Response } from "express";
import { PartnerDB } from "../../models/partner";
import { ExtendedRequest, ResponseObject } from "../../interfaces";
import cloudinary from 'cloudinary';

class PartnerController{
    constructor(){

    }

    public static getPartners = async(req:ExtendedRequest, res: Response) => {
        let response: ResponseObject<any>;
        try {
            const partners = await PartnerDB.getAllPartner();
            response = {
                ResponseData: partners,
                ResponseMessage: 'Partners fetched',
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
    
    public static getPartnerById = async(req:ExtendedRequest, res: Response) => {
        const id = Number(req.params.id);

        let response: ResponseObject<any>;

        try{
            const partner = await PartnerDB.getPartnerById(id);
            response = {
                ResponseData: partner,
                ResponseMessage: 'Partner fetched',
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static insertPartner = async(req: ExtendedRequest, res: Response) => {
        const name = req.body.name;
        const testimony = req.body.testimony;
        const file = req.file;
        const createdBy = req.user.id;

        let response: ResponseObject<any>;
        let fileId: string;
        let fileURL: string;
        
        try {
            if(file){
                const {public_id, url} = await cloudinary.v2.uploader.upload(file.path, {folder: 'alka-industries/partners'});
                fileId = public_id;
                fileURL = url;
            }
            await PartnerDB.insertPartner(name, fileId, fileURL, createdBy, testimony);
            response = {
                ResponseData: null,
                ResponseMessage: 'Partner Added Successfully.'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updatePartner = async(req: ExtendedRequest, res:Response) => {
        const id = Number(req.params.id);
        const name = req.body.name;
        const testimony = req.body.testimony;
        const file = req.file;

        let response: ResponseObject<any>;
        let fileId: string;
        let fileURL: string;

        try {
            if(file){
                const {public_id, url} = await cloudinary.v2.uploader.upload(file.path, {folder: 'alka-industries/partners'});
                fileId = public_id
                fileURL = url
            }
            await PartnerDB.updatePartnerById(id, name, fileId, fileURL, testimony);
            response = {
                ResponseData: null,
                ResponseMessage: 'Partner updated.'
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static deletePartner = async(req: ExtendedRequest, res: Response) => {
        const id = Number(req.params.id);

        let response: ResponseObject<any>;

        try {
            await PartnerDB.deletePartnerById(id);
            response = {
                ResponseData: null,
                ResponseMessage: 'Partner deleted.'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const GetPartners = PartnerController.getPartners;
const GetPartnerById = PartnerController.getPartnerById;
const InsertPartner = PartnerController.insertPartner;
const UpdatePartner = PartnerController.updatePartner;
const DeletePartner = PartnerController.deletePartner;

export {
    GetPartners,
    GetPartnerById,
    InsertPartner,
    UpdatePartner,
    DeletePartner,
}