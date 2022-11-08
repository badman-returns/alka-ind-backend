import {Category} from '../interfaces';
import { Tables } from '../configs/table.config';
import db from '../models/db';
import { resolve } from 'path';
import { Result } from 'express-validator';


export class CategoryDB{
    constructor(){

    }

    public static getAllCategories():Promise<Array<Category>> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.CATEGORY}` , (err,res) => {
                if(err){
                    return reject(err);
                }
                if(reject.length) {
                    return resolve(res.map((result: any) => 
                    Object.assign({}, result)));
                }
                return resolve(null);
            });
        });
    };

    public static getCategoryById(id: number): Promise<Category>{
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.CATEGORY} WHERE id=${id}`, (err,res) => {
                if(err){
                    return reject(err);
                }
                if(res.length) {
                    return resolve(res.map((result: any) =>
                    Object.assign({}, result))[0]);
                }
            });
        });
    };

    public static insertCategory(name: string, createdBy: number): Promise<string>{
        return new Promise((resolve, reject) =>{
            db.query(`INSERT INTO ${Tables.CATEGORY} (name, createdBy) VALUES ('${name}', '${createdBy}')`, (err, res) => {
                if(err){
                    return reject(err);
                }
                return resolve(res.insertId);
            });
        });
    };
    public static updateCategoryById(id: string, name: string): Promise<any>{
        return new Promise((resolve,reject) => {
            db.query(`UPDATE ${Tables.CATEGORY} SET name='${name}' WHERE ${Tables.CATEGORY}.id=${id}`,(err,res) => {
                if(err){
                    return reject(err);
                }
                return resolve(null);
            });
        });
    };
    public static deleteCategoryById(id: number): Promise<any>{
        return new Promise((resolve,reject)=>{
            db.query(`DELETE FROM ${Tables.CATEGORY} WHERE ${Tables.CATEGORY}.id=${id}`,(err,res)=>{
                if(err){
                    return reject(err);
                }
                return resolve(null);
            });
        });
    };
}