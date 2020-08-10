
import * as mongoose from 'mongoose';
import { Request, Response } from "express";
import { BaseController } from "../BaseController"
import { CryptoTools } from "../../security/CryptoTools";
import { PublicKey } from "../../security/RSA/model/PublicKey";
import { JWTSession } from "../../security/JWT/model/JWTSession";
import { JWTStatusModel } from "../../security/JWT/model/JWTStatusModel";
import { SessionTokenModel } from "../../security/JWT/model/SessionTokenModel";
import { AccessTokenModel } from "../../security/JWT/model/AccessTokenModel";
import { JWTType } from "../../security/JWT/model/JWTType"
import { UserSchema } from '../../models/user/UserModel';
import { HTTPStatus } from '../../models/http/HTTPStatus';
import { Logger } from '../../tools/Logger'

const User = mongoose.model('User', UserSchema);

export class AuthController extends BaseController {

    public publicKey(req: Request, res: Response) {
        let publicKeyModel = new PublicKey(CryptoTools.RSA().publicKey())
        Logger.log(publicKeyModel, AuthController.name, "publicKey")
        super.send(res, publicKeyModel)
    }

    public validateToken(req: Request, res: Response) {
        try {
            var token = CryptoTools.JWT().instance().verify(req.params.token)
            Logger.log(token, AuthController.name, "validateToken")
            if (token) {
                super.send(res, new JWTStatusModel(true))
            }
            else {
                super.send(res, new JWTStatusModel(false))
            }
            return
        } catch (error) {
            Logger.log(token, AuthController.name, "validateToken")
            super.send(res, new JWTStatusModel(false))
            return
        }
    }

    public accessToken(req: Request, res: Response) {
        let body = JSON.parse(JSON.stringify(req.body))
        let plainData = CryptoTools.RSA().decrypt(req.body.data, "json")
        let session = new JWTSession(plainData, JWTType.ACCESS)
        let encrypted = CryptoTools.JWT().signAccessToken(session)
        let accessToken = JSON.parse(JSON.stringify(new AccessTokenModel(encrypted)))

        Logger.log(body, AuthController.name, "accessToken", "body")
        Logger.log(plainData, AuthController.name, "accessToken", "plain")
        Logger.log(session, AuthController.name, "accessToken" , "session")
        Logger.log(accessToken, AuthController.name, "accessToken", "accessToken")

        super.send(res, accessToken)
    }

    public login(req: Request, res: Response) {

        const token = new JWTSession(req.params.access);

        let userData = CryptoTools.AES().decrypt(req.body.data, token)
            
        let userModel = User(JSON.parse(userData))

        if (userModel == null) {
            super.send(res, undefined, new HTTPStatus.CLIENT_ERROR.BAD_REQUEST)
            return
        }

        User.findOne({ 'firebaseID': userModel.firebaseID }, (error, user) => {
            if (error) {
                super.send(res, undefined, new HTTPStatus.BUSINESS.DUPLICATED_REGISTER);
                return
            }
            if (user) {
                Logger.log(user, AuthController.name, "user", "created")
                let sessionToken = AuthController.generateSessionToken(user, token)

                super.send(res, sessionToken)
                return
            }
            else {
                userModel.save((error, user) => {
                    if (error) {
                        super.send(res, undefined, new HTTPStatus.BUSINESS.DUPLICATED_REGISTER);
                        return
                    }

                    let sessionToken = AuthController.generateSessionToken(user, token)

                    super.send(res, sessionToken)
                });
            }
        });
    }

    public register(req: Request, res: Response) {
        
        const token = new JWTSession(req.params.access);

        let userData = CryptoTools.AES().decrypt(req.body.data, token)
            
        let userModel = User(JSON.parse(userData))

        if (userModel == null) {
            super.send(res, undefined, new HTTPStatus.CLIENT_ERROR.BAD_REQUEST)
            return
        }

        User.findOne({ 'firebaseID': userModel.firebaseID }, (error, user) => {
            if (user) {
                super.send(res, undefined, new HTTPStatus.BUSINESS.DUPLICATED_REGISTER)
                return
            }
            else {
                userModel.save((error, user) => {
                    if (error) {
                        super.send(res, undefined, new HTTPStatus.BUSINESS.DUPLICATED_REGISTER);
                        return
                    }
                    super.send(res, user)
                });
            }
        });
    }

    private static generateSessionToken(user: any, token: JWTSession) {
        token.userID = user._id

        token.uid = user.firebaseID

        let session = new JWTSession(token, JWTType.SESSION)

        let sessionTokenEncrypted = CryptoTools.JWT().signSessionToken(session)

        return JSON.parse(JSON.stringify(new SessionTokenModel(sessionTokenEncrypted)))
    }
}