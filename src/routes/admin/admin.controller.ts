import { Response } from "express";
import { Encryption } from "../../utility";
import { ExtendedRequest, ResponseObject, User } from "../../interfaces";
import { UserDB } from '../../models';

class AdminController {
    constructor() {

    }

    public static loginByEmailAndPassword = async (req: ExtendedRequest, res: Response) => {
        try {
            const buf = Buffer.from(req.token, 'base64');
            const credential = buf.toString().split(':');
            if (credential.length !== 2) {
                return res.status(400).send();
            }
            const email = credential[0];
            const password = credential[1];
            if (!email || !password) {
                return res.status(400).send();
            }

            const user: User = await UserDB.getUserByEmail(email);

            if (!user) {
                res.status(403).send({
                    Message: `You dont have account with us!`,
                    Data: null,
                });
            } else if (user && !Encryption.decryptPassword(password, user.password)) {
                res.status(401).send({
                    Message: `incorrect password! You can try RESET PASSWORD option if you forgot your paswword.`,
                    Data: null,
                });
            } else {
                delete user.password;
                delete user.createdOn;
                let token: any;
                try {
                    token = await Encryption.createToken(user);
                } catch (err) {
                    return res.status(500).end();
                }
                res.setHeader("Access-Control-Expose-Headers", "Authorization");
                res.setHeader("Authorization", token);
                res.send(user);
            }
        } catch (error) {
            return res.status(500).end();
        }
    }

    public static updateUserName = async (req: ExtendedRequest, res: Response) => {
        const name = req.body.name;
        const email = req.user.email;
        let response: ResponseObject<any>;
        try {
            await UserDB.updateUserName(name, email);
            response = {
                ResponseData: null,
                ResponseMessage: 'Username updated',
            }
        } catch(error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    };

    public static updateUserPassword = async (req: ExtendedRequest, res: Response) => {
        const email = req.user.email;
        const password = Encryption.encryptPassword(req.body.password);
        let response : ResponseObject<any>;
        try {
            await UserDB.updatePassword(email, password);
            response = {
                ResponseData: null,
                ResponseMessage: 'Password updated',
            }
        }catch(error){
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const LoginByEmailPassword = AdminController.loginByEmailAndPassword;
const UpdateUserName = AdminController.updateUserName;
const UpdateUserPassword = AdminController.updateUserPassword;

export {
    LoginByEmailPassword,
    UpdateUserName,
    UpdateUserPassword
}