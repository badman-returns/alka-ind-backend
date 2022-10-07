import { Encryption } from "../utility";
import { Tables } from "../configs/table.config";
import db from '../models/db';

export default class CreateTablesAndInsertMasterData {
    constructor(){

    }

    // Super Admin Table
    private static async createAdminUserTable(): Promise<boolean>{
        return new Promise((resolve, reject) => {
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.ADMIN}    (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                createdOn DATETIME default current_timestamp,
                CONSTRAINT primary_admin UNIQUE(email))
                `, (err, res) => {
                    if(err){
                        return reject(err);
                    }
                    if(res.length){
                        return resolve(true);
                    }
                    return resolve(null);
                });
        });
    };

    private static createSuperAdminUser(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const user = {
                name: "Administrator",
                email: "admin@admin.com",
                password: Encryption.encryptPassword(process.env.ADMIN_DEFAULT_PASSWORD),
            };

            db.query(`INSERT IGNORE INTO ${Tables.ADMIN} SET ?`, user, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }

    public static async createUserTableAndSuperAdmin() {
        try {
            await CreateTablesAndInsertMasterData.createAdminUserTable();
        } catch (e) {
            console.error('CREATE SUPER USER TABLE', e);
        }

        try {
            await CreateTablesAndInsertMasterData.createSuperAdminUser();
        } catch (e) {
            console.error('CREATE SUPER ADMIN', e);
        }
    }
};