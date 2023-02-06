import { UploadFile } from "./file.model";

interface OrganisationInfo{
    id: number,
    name: string,
    phone: string,
    email: string,
    address: string,
    updatedBy: string,
    createdOn: string,
    updatedOn: string,
    files: Array<UploadFile>
    fileId: string,
    fileURL: string,
}

export {
    OrganisationInfo
}