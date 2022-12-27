import { Encryption } from "../utility";
import { Tables } from "../configs/table.config";
import db from '../models/db';
import { OrganisationInfo } from "../interfaces/organisationSetup.model";
import { ReadFile } from "../utility/readWriteJSON";
import { About } from "../interfaces/";

export default class CreateTablesAndInsertMasterData {
    constructor() {

    }

    // Super Admin Table
    private static async createAdminUserTable(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.USER}    (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                createdOn DATETIME default current_timestamp,
                CONSTRAINT primary_admin UNIQUE(email))
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
                fileId VARCHAR(255),
                fileURL VARCHAR(255),
                createdBy VARCHAR(255) NOT NULL,
                updatedBy VARCHAR(255),
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT company_name UNIQUE (name))
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
            let OrganisationInfo: Array<any>;
            let keys: Array<any>;
            let values: Array<any>;

            OrganisationInfo = await CreateTablesAndInsertMasterData.constructDefaultOrganisationInfo();
            keys = Object.keys(OrganisationInfo[0]);
            values = OrganisationInfo.map(obj => keys.map(key => obj[key]));

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

    private static createAboutTable(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.ABOUT} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                title VARCHAR(255) NOT NULL,
                content VARCHAR(255) NOT NULL,
                fileId VARCHAR(255),
                fileURL VARCHAR(255),
                createdBy VARCHAR(255) NOT NULL,
                updatedBy VARCHAR(255),
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT about_title UNIQUE (title))
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

    private static insertDefaultAboutContent() {
        return new Promise((resolve, reject) => {
            let AboutInfo: About = {
                title: `About`,
                content: 'About Content',
                fileId: null,
                fileURL: null,
                createdBy: 1,
                updatedBy: null,
            }

            db.query(`INSERT IGNORE INTO ${Tables.ABOUT} SET ?`, AboutInfo, (err, res) => {
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

    public static async createAboutTableAndInsertDefaultData() {
        try {
            await CreateTablesAndInsertMasterData.createAboutTable();
        } catch (e) {
            console.error('CREATE ABOUT TABLE', e);
        }

        try {
            await CreateTablesAndInsertMasterData.insertDefaultAboutContent();
        } catch (e) {
            console.error('INSERT ABOUT CONTENT', e);
        }

    }

    public static async createBannerTable() {
        return new Promise((resolve, reject) => {
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.BANNER} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                fileId VARCHAR(255) NOT NULL,
                fileName VARCHAR(255) NOT NULL,
                fileURL VARCHAR(255) NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                createdOn DATETIME NOT NULL DEFAULT current_timestamp)
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            }
            );
        });
    }

    public static async createPartnerTable(){
        return new Promise((resolve, reject) => {
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.PARTNER} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                name VARCHAR(255) NOT NULL,
                testimony VARCHAR(500),
                fileId VARCHAR(255),
                fileURL VARCHAR(255),
                createdBy VARCHAR(255) NOT NULL,
                createdOn DATETIME NOT NULL DEFAULT current_timestamp,
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp)
                `, (err, res) =>{
                    if(err){
                        return reject(err);
                    }
                    if(res.length){
                        return resolve(true);
                    }
                    return resolve(null);
                })
        })
    }

    public static async createCategoryTable(){
        return new Promise((resolve, reject) => {
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.CATEGORY} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                name VARCHAR(255) NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                createdOn DATETIME NOT NULL DEFAULT current_timestamp)
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
    }
};
