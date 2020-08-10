
import * as mongoose from 'mongoose';
import { Request, Response } from "express";
import { BaseController } from "../BaseController"
import { UserSchema } from '../../models/user/UserModel';

const User = mongoose.model('User', UserSchema);

export class UserController extends BaseController {  
    
    public create(req: Request, res: Response) {

        let newUser = new User(req.body);

        newUser.save((error, user) => {
            if (error) {
                super.send(res, error);
            }
            super.send(res, user);
        });
    }

    public get(req: Request, res: Response) {

        console.log("\n=======\n")
        console.log("get user SESSION: "+ JSON.stringify(super.session(req)))
        console.log("\n=======\n")

        User.find({}, (error, user) => {
            if (error) {
                super.send(res, error);
            }
            super.send(res, user);
        });
    }

    public find(req: Request, res: Response) {
        User.findById(req.params.firebaseID, (error, user) => {
            if (error) {
                super.send(res, error);
            }
            super.send(res, user);
        });
    }

    public update(req: Request, res: Response) {
        User.findOneAndUpdate({ _id: req.params.firebaseID }, req.body, { new: true }, (error, user) => {
            if (error) {
                super.send(res, error);
            }
            super.send(res, user);
        });
    }

    public delete(req: Request, res: Response) {
        User.remove({ _id: req.params.firebaseID }, (error, user) => {
            if (error) {
                super.send(res, error);
            }
            super.send(res, user);
        });
    }

}