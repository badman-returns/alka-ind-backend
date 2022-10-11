import { Tables } from "../configs/table.config";
import { About } from "../interfaces";
import db from './db';

export class AboutDB{
    constructor(){

    }

    public static updateAbout(content: string):Promise<any>{
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.ABOUT} SET content=? WHERE ${Tables.ABOUT}.title='About'`, [content], (err, res) => {
                if(err){
                    return reject(err);
                }
                return resolve(null);
            })
        });
    }

    public static getAbout(): Promise<About>{
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.ABOUT} WHERE ${Tables.ABOUT}.title='About'`, (err, res) => {
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