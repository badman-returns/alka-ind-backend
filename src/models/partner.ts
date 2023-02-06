import { Partner } from '../interfaces';
import { Tables } from '../configs/table.config';
import db from './db';

export class PartnerDB {
    constructor() {

    }

    public static getAllPartner(): Promise<Array<Partner>> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.PARTNER}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(res.map((result: any) => Object.assign({}, result)));
                }
                return resolve(null);
            });
        });
    };

    public static getPartnerById(id: number): Promise<Partner> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.PARTNER} WHERE id=${id}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(res.map((result: any) => Object.assign({}, result))[0]);
                }
            })
        })
    }

    public static insertPartner(name: string, createdBy: number, testimony?: string, fileId?: string, fileURL?: string,): Promise<string> {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${Tables.PARTNER} (name, testimony, fileId, fileURL, createdBy) VALUES ('${name}', "${testimony}", '${fileId}', '${fileURL}', '${createdBy}')`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.insertId);
            });
        });
    };

    public static updatePartnerById(id: number, name: string, testimony?: string, fileId?: string, fileURL?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (fileId && fileURL) {
                db.query(`UPDATE ${Tables.PARTNER} SET name=?, testimony=?, fileId=?, fileURL=? WHERE ${Tables.PARTNER}.id=${id}`, [name, testimony, fileId, fileURL], (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(null);
                });
            } else {
                db.query(`UPDATE ${Tables.PARTNER} SET name=?, testimony=? WHERE ${Tables.PARTNER}.id=${id}`, [name, testimony], (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(null);
                });
            }
        });
    };

    public static deletePartnerById(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${Tables.PARTNER} WHERE ${Tables.PARTNER}.id=${id}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(null);
            })
        })
    }
}