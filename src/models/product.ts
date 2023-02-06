import { Tables } from "../configs/table.config";
import { Product } from "../interfaces";
import db from './db';

export class ProductDB {
    constructor() {

    }

    public static insertProduct(name: string, categoryId: number, code: string, description: string, productImageId: string, productImageURL: string, productGLBId: string, productGLBURL: string, createdBy: number): Promise<string> {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${Tables.PRODUCT} (name, categoryId, code, description, productImageId, productImageURL, productGLBId, productGLBURL, createdBy) VALUES ('${name}', '${categoryId}', '${code}', '${description}', '${productImageId}', '${productImageURL}', '${productGLBId}', '${productGLBURL}', '${createdBy}')`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res.insertId);
            })
        });
    }

    public static updateProduct(id: number, name: string, categoryId: number, code: string, description: string, productImageId?: string, productImageURL?: string, productGLBId?: string, productGLBURL?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (productImageURL && productGLBURL) {
                db.query(`UPDATE ${Tables.PRODUCT} SET productImageId=?, productImageURL=?, productGLBId=?, productGLBURL=?`, [productImageId, productImageURL, productGLBId, productGLBURL], (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(null);
                })
            }
            if (productImageURL) {
                db.query(`UPDATE ${Tables.PRODUCT} SET productImageId=?, productImageURL=? WHERE ${Tables.PRODUCT}.id=${id}`, [productImageId, productImageURL], (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(null);
                })
            }
            if (productGLBURL) {
                db.query(`UPDATE ${Tables.PRODUCT} SET productGLBId=?, productGLBURL=?`, [productGLBId, productGLBURL], (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(null);
                })
            }
            else {
                db.query(`UPDATE ${Tables.PRODUCT} SET name=?, categoryId=?, code=?, description=?, productImageId=?, productImageURL=?, productGLB=?, productGLBURL=? WHERE ${Tables.PARTNER}.id=${id}`, [name, categoryId, code, description, productImageId, productImageURL, productGLBId, productGLBURL], (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(null);
                });
            }
        });
    }

    public static getProducts(start: number, end: number): Promise<Array<Product>> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.PRODUCT} LIMIT ${start}, ${end}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(res.map((result: any) => Object.assign({}, result)));
                }
                return resolve(null);
            });
        });
    }

    public static getProductByCategory(start: number, end: number, categoryId: number): Promise<Array<Product>> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.PRODUCT} WHERE ${Tables.PRODUCT}.categoryId=${categoryId} LIMIT ${start}, ${end}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(res.map((result: any) => Object.assign({}, result)));
                }
                return resolve(null);
            })
        })
    }

    public static getProductsById(id: number): Promise<Product> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.PRODUCT} WHERE ${Tables.PRODUCT}.id=${id}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(res.map((result: any) => Object.assign({}, result))[0]);
                }
                return resolve(null);
            });
        });
    }

    public static deleteProductById(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${Tables.PRODUCT} WHERE ${Tables.PRODUCT}.id=${id}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(null);
                }
            });
        });
    }
}