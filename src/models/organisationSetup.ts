import { Tables } from "../configs/table.config";
import { OrganisationInfo } from "../interfaces/organisationSetup.model";
import db from './db';

export class OrganisationDB {
    constructor() {

    }

    public static updateOrganisationInfo(name: string, phone: string, email: string, address: string, logo: string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.ORGANISATION} SET name=?, phone=?, email=?, address=?, logo=? WHERE id=1`, [name, phone, email, address, logo], (err, res) => {
                if(err){
                    return reject(err);
                }
                return resolve(null);
            })
        })
    }

    public static getOrganisationInfo():Promise<OrganisationInfo>{
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.ORGANISATION} WHERE id=1`, (err, res) => {
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