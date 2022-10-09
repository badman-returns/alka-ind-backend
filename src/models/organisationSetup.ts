import { Tables } from "../configs/table.config";
import { OrganisationInfo } from "../interfaces/organisationSetup.model";
import db from './db';

export class OrganisationDB {
    constructor() {

    }

    public static updateOrganisationInfo(name: string, phone: string, email: string, address: string, updatedBy:number, fileId?: string, fileURL?:string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.ORGANISATION} SET name=?, phone=?, email=?, address=?, fileId=?, fileURL=?, updatedBy=? WHERE id=1`, [name, phone, email, address, fileId, fileURL, updatedBy], (err) => {
                if(err){
                    return reject(err);
                }
                return resolve(null);
            })
        })
    }

    public static getOrganisationInfo():Promise<OrganisationInfo>{
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.ORGANISATION}.id, ${Tables.ORGANISATION}.name, ${Tables.ORGANISATION}.email, ${Tables.ORGANISATION}.address, ${Tables.ORGANISATION}.fileURL, ${Tables.USER}.name as createdBy, ${Tables.USER}.name as updatedBy 
                      FROM ${Tables.ORGANISATION}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.ORGANISATION}.updatedBy
                      `, (err, res) => {
                if(err){
                    return reject(err);
                }
                if(res.length){
                    return resolve(Object.assign({}, res[0]));
                }
                return resolve(null);
            })
        })
    }
}