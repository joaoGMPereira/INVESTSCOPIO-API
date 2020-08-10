import * as mongoose from 'mongoose';
import { NPSSchema } from '../../models/nps/npsModel';
import { Request, Response } from "express";
import { BaseController } from "../BaseController"
import { HTTPStatus } from '../../models/http/HTTPStatus';


const NPS = mongoose.model('NPS', NPSSchema);

export class NPSController extends BaseController {
    public add(req: Request, res: Response) {
        //TODO: authorizedUser
        let nps = req.body
        nps.userID = super.session(req).userID
        nps.versionApp = NPSController.transformVersionToIntWithPadding(nps.versionApp)
        let newNPS = new NPS(req.body);

        NPS.findOneAndUpdate({ 'userID': newNPS.userID, 'versionApp': newNPS.versionApp }, newNPS, (err, nps) => {
            if (nps) {
                super.send(res, nps, undefined, 'Obrigado pela avaliação!');
            } else {
                newNPS.save((err, nps) => {
                    if (err) {
                        super.send(res, undefined, new HTTPStatus.CLIENT_ERROR.BAD_REQUEST);
                    }
                    super.send(res, nps, undefined, 'Obrigado pela avaliação!');
                });
            }
        });

    }

    public static transformVersionToIntWithPadding(version: string): Number {
        let versionArray: Array<string> = version.split('.')
        var versionWithPadding = ""

        versionArray.forEach(versionNumber => {
            let versionPadding = NPSController.leadingNullString(versionNumber, 4)
            versionWithPadding = versionWithPadding + versionPadding
        });

        return +versionWithPadding
    }

    public static leadingNullString(value: string | number, minSize: number): string {
        if (typeof value == "number") {
            value = "" + value;
        }
        let outString: string = '';
        let counter: number = minSize - value.length;
        if (counter > 0) {
            for (let i = 0; i < counter; i++) {
                outString += '0';
            }
        }
        return (value + outString);
    }

    public get(req: Request, res: Response) {
        NPS.find({}, (err, nps) => {
            if (err) {
                super.send(res, undefined, new HTTPStatus.CLIENT_ERROR.BAD_REQUEST);
            }
            super.send(res, nps);
        });
    }

    public getWithID(req: Request, res: Response) {
        NPS.findById(req.params.npsID, (err, nps) => {
            if (err) {
                super.send(res, undefined, new HTTPStatus.CLIENT_ERROR.BAD_REQUEST);
            }
            super.send(res, nps);
        });
    }

    public update(req: Request, res: Response) {
        NPS.findOneAndUpdate({ _id: req.params.npsID }, req.body, { new: true }, (err, nps) => {
            if (err) {
                super.send(res, undefined, new HTTPStatus.CLIENT_ERROR.BAD_REQUEST);
            }
            super.send(res, nps);
        });
    }

    public delete(req: Request, res: Response) {
        NPS.remove({ _id: req.params.npsID }, (err, nps) => {
            if (err) {
                super.send(res, undefined, new HTTPStatus.CLIENT_ERROR.BAD_REQUEST);
            }
            super.send(res, nps);
        });
    }

}