import db from './db';
import { User } from '../interfaces';
import { Tables } from '../configs/table.config';

export class UserDB{
    constructor(){

    }

    public static getUserByEmail(email:string): Promise<User>{
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.USER} WHERE email='${email}'`, (err, res) => {
                if(err){
                    return reject(err);
                }
                if(res.length){
                    return resolve(Object.assign({}, res[0]));
                }
                return resolve(null);
            });
        });
    }

    public static updateUserName(name: string, email:string): Promise<User>{
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.USER} SET name='${name}' WHERE ${Tables.USER}.email='${email}'`,(err, res) => {
                if(err){
                    return reject(err);
                }
                return resolve(null);
            });
        });
    }

    public static updatePassword(email: string, password: string): Promise<User>{
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.USER} SET password='${password}' WHERE ${Tables.USER}.email='${email}'`, (err, res) => {
                if(err){
                    return reject(err);
                }
                return resolve(null);
            })
        })
    }
}