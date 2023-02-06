import { Response } from "express";
import { OrganisationDB } from "../../models";
import { ExtendedRequest, ResponseObject } from "../../interfaces";
import cloudinary from 'cloudinary';

class OrganisationController {
    constructor() {

    }

    public static getOrganisationInfo = async (req: ExtendedRequest, res: Response) => {
        let response: ResponseObject<any>;
        try {
            const organisationInfo = await OrganisationDB.getOrganisationInfo();
            response = {
                ResponseData: organisationInfo,
                ResponseMessage: 'Organisation Info fetched',
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updateOrganisationInfo = async (req: ExtendedRequest, res: Response) => {
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;
        const address = req.body.address;
        const file = req.file;
        const updatedBy = req.user.id;

        let response: ResponseObject<any>;
        let fileId: string;
        let fileURL: string;
        try {
            if (file) {
                const { public_id, url } = await cloudinary.v2.uploader.upload(file.path, { folder: 'alka-industries/organisation' })
                fileId = public_id,
                fileURL = url
            }
            await OrganisationDB.updateOrganisationInfo(name, phone, email, address, updatedBy, fileId, fileURL);
            response = {
                ResponseData: null,
                ResponseMessage: 'Organisation Info Updated'
            }
        } catch (error) {
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