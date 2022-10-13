import { Banner } from '../interfaces/banner.model';
import { Tables } from '../configs/table.config';
import db from './db';

export class BannerDB {
    constructor() {

    }

    public static getAllBanners(): Promise<Array<Banner>> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.BANNER}.id, ${Tables.BANNER}.fileName, ${Tables.BANNER}.fileURL, ${Tables.USER}.name as createdBy, ${Tables.BANNER}.createdOn
                      FROM ${Tables.BANNER}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.BANNER}.createdBy
                      ORDER BY ${Tables.BANNER}.createdOn DESC
                      `, (err, res) => {
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


    public static getBannerById(id:number): Promise<Array<Banner>> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.BANNER}.id, ${Tables.BANNER}.fileName, ${Tables.BANNER}.fileURL, ${Tables.USER}.name as createdBy, ${Tables.BANNER}.createdBy
                      FROM ${Tables.BANNER}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.BANNER}.createdBy WHERE ${Tables.BANNER}.id=${id}
                      `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(res.map((result: any) => Object.assign({}, result))[0]);
                }
                return resolve(null);
            });
        });
    };


    public static insertBanner(fileName: string, fileId: string, fileURL: string, createdBy: number): Promise<string> {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${Tables.BANNER} (fileId, fileName, fileURL, createdBy) VALUES ('${fileId}', '${fileName}','${fileURL}', '${createdBy}')`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.insertId);
            });
        });
    };

    public static deleteBannerById(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${Tables.BANNER} WHERE ${Tables.BANNER}.id=${id}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(null);
            })
        })
    }
};