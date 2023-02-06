import {Response} from 'express';
import { BannerDB } from '../../models/banner';
import { ExtendedRequest, ResponseObject } from '../../interfaces';
import cloudinary from 'cloudinary';


class BannerController{
    constructor(){

    }

    public static getBanners = async(req: ExtendedRequest, res: Response) => {
        let response: ResponseObject<any>;
        try{
            const banners = await BannerDB.getAllBanners();
            response = {
                ResponseData: banners,
                ResponseMessage: 'Banners Fetched',
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static getBannerById = async(req:ExtendedRequest, res: Response) => {
        const bannerId = Number(req.params.id);

        let response: ResponseObject<any>;

        try{
            const banner = await BannerDB.getBannerById(bannerId);
            response = {
                ResponseData: banner,
                ResponseMessage: 'Banner fetched'
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static insertBanner = async(req: ExtendedRequest, res: Response) => {
        const file = req.file;
        const createdBy = req.user.id;

        let response: ResponseObject<any>;
        let fileId: string;
        let fileURL: string;
        try {
            if(file){
                const {public_id, url} = await cloudinary.v2.uploader.upload(file.path, {folder: 'alka-industries/banners'});
                fileId  = public_id;
                fileURL = url;
            }
            await BannerDB.insertBanner(file.filename, fileId, fileURL, createdBy);
            response = {
                ResponseData: null,
                ResponseMessage: 'Banner Inserted',
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static deleteBanner = async(req: ExtendedRequest, res:Response) => {
        const id= Number(req.params.id);
        
        let response: ResponseObject<any>;
        try{
            await BannerDB.deleteBannerById(id);
            response = {
                ResponseData: null,
                ResponseMessage: 'Banner Deleted',
            };
        }catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const GetAllBanners = BannerController.getBanners;
const GetBannerById = BannerController.getBannerById;
const InsertBanner = BannerController.insertBanner;
const DeleteBanner = BannerController.deleteBanner;

export {
    GetAllBanners,
    GetBannerById,
    InsertBanner,
    DeleteBanner,
}
