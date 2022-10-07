import { Response } from "express";
import { OrganisationDB } from "../../models";
import { ExtendedRequest, ResponseObject } from "../../interfaces";

class OrganisationController{
    constructor(){

    }

    public static getOrganisationInfo = async (req:ExtendedRequest, res: Response) => {
        let response: ResponseObject<any>;
        try{
            const organisationInfo = await OrganisationDB.getOrganisationInfo();
            response = {
                ResponseData: organisationInfo,
                ResponseMessage: 'Organisation Info fetched',
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updateOrganisationInfo = async(req:ExtendedRequest, res: Response) => {
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;
        const address = req.body.address;
        const logo = req.body.logo;

        let response : ResponseObject<any>;

        try{
            await OrganisationDB.updateOrganisationInfo(name, phone, email, address, logo);
            response = {
                ResponseData: null,
                ResponseMessage: 'Organisation Info Updated'
            }
        } catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const GetOrganisationInfo = OrganisationController.getOrganisationInfo;
const UpdateOrganisationInfo = OrganisationController.updateOrganisationInfo;

export {
    GetOrganisationInfo,
    UpdateOrganisationInfo
}