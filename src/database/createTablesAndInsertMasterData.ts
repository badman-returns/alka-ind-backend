import { Encryption } from "../utility";
import { Tables } from "../configs/table.config";
import db from '../models/db';
import { OrganisationInfo } from "../interfaces/organisationSetup.model";
import { ReadFile } from "../utility/readWriteJSON";

export default class CreateTablesAndInsertMasterData {
    constructor(){

    }

    // Super Admin Table
    private static async createAdminUserTable(): Promise<boolean>{
        return new Promise((resolve, reject) => {
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.USER}    (
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

            db.query(`INSERT IGNORE INTO ${Tables.USER} SET ?`, user, (err, res) => {
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

    private static constructDefaultOrganisationInfo(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let OrganisationInfo: Array<any> = [];
                const infos = await ReadFile<Array<OrganisationInfo>>(`../../data/OrganisationInfo.json`);
                infos.forEach((info, index, array) => {
                    OrganisationInfo.push({
                        name: info.name,
                        phone: info.phone,
                        email: info.email,
                        address: info.address,
                        createdBy: '1',

                    });

                    if (array.length === index + 1) {
                        resolve(OrganisationInfo);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private static createOrganisationTable() {
        return new Promise((resolve, reject) => {
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.ORGANISATION} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                updatedBy VARCHAR(255),
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT primary_name UNIQUE (name))
            `, (err, res) => {
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


    private static insertDefautOrganisationInfo() {
        return new Promise(async (resolve, reject) => {
            let InstituteInfo: Array<any>;
            let keys: Array<any>;
            let values: Array<any>;

            InstituteInfo = await CreateTablesAndInsertMasterData.constructDefaultOrganisationInfo();
            keys = Object.keys(InstituteInfo[0]);
            values = InstituteInfo.map(obj => keys.map(key => obj[key]));

            db.query(`INSERT IGNORE INTO ${Tables.ORGANISATION} (${keys.join(',')}) VALUES ?`, [values], (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        })
    }

    public static async createOrganisationTableAndInsertInfos() {
        try {
            await CreateTablesAndInsertMasterData.createOrganisationTable();
        } catch (e) {
            console.error('CREATE ORGANISATION TABLE', e);
        }

        try {
            await CreateTablesAndInsertMasterData.insertDefautOrganisationInfo();
        } catch (e) {
            console.error('INSERT ORGANISATION INFO', e);
        }

    }
};
