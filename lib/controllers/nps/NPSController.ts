import * as mongoose from 'mongoose'
import { NPSSchema } from '../../models/nps/npsModel'
import { Request, Response } from "express"
import { BaseController } from "../BaseController"
import { HTTPStatus } from '../../models/http/HTTPStatus'
import { CryptoTools } from "../../security/CryptoTools"
import { Logger } from '../../tools/Logger'

const NPS = mongoose.model('NPS', NPSSchema);

export class NPSController extends BaseController {
    public add(req: Request, res: Response) {
        const token = super.session(req)
        let data = CryptoTools.AES().decrypt(req.body.data, token)
        let npsRequest = NPS(JSON.parse(data))
        npsRequest.userID = super.session(req).userID
        npsRequest.versionApp = NPSController.transformVersionToIntWithPadding(npsRequest.versionApp)
        NPS.findOneAndUpdate({userID: super.session(req).userID, versionApp:npsRequest.versionApp}, {$set: { rate: npsRequest.rate, updatedAt: Date.now() }, $inc: { __v: 1 }}, { new: true}, (err, nps) => {
            if (nps) {
                super.send(res, nps, undefined, "Avaliação atualizada com sucesso!");
            } else {
                npsRequest.save((err, nps) => {
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