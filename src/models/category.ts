import {Category} from '../interfaces';
import { Tables } from '../configs/table.config';
import db from '../models/db';


export class CategoryDB{
    constructor(){

    }

    public static insertCategory(name: string, createdBy: number): Promise<string>{
        return new Promise((resolve, reject) =>{
            db.query(`INSERT INTO ${Tables.CATEGORY} (name, createdBy) VALUES ('${name}', '${createdBy}')`, (err, res) => {
                if(err){
                    return reject(err);
                }
                return resolve(res.insertId);
            })
        })
    }
}