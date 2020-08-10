import * as mongoose from 'mongoose';
import { Request, Response } from "express";
import { HTTPStatus } from '../../models/http/HTTPStatus';

import { BrandSchema } from '../../models/brand/BrandModel';

import { CryptoTools } from "../../security/CryptoTools";
import { JWTSession } from "../../security/JWT/model/JWTSession";
import { Logger } from '../../tools/Logger'

import { BaseController } from "../BaseController"

import { CreateBrandUseCase } from "../../usecase/brand/CreateBrandUseCase"
import { DeleteBrandUseCase } from "../../usecase/brand/DeleteBrandUseCase"
import { UpdateBrandUseCase } from "../../usecase/brand/UpdateBrandUseCase"
import { FetchBrandUseCase } from "../../usecase/brand/FetchBrandUseCase"
import { GetBrandUseCase } from "../../usecase/brand/GetBrandUseCase"

const Brand = mongoose.model('Brand', BrandSchema);

export class BrandController extends BaseController {

    public async get(req: Request, res: Response) {

        let brand = await new GetBrandUseCase().get(req.params.id)

        Logger.log(brand, BrandController.name, "get")

        super.send(res, brand, new HTTPStatus.SUCESS.OK)
    }

    public async fetch(req: Request, res: Response) {

        let brands = await new FetchBrandUseCase().fetch()

        Logger.log(brands, BrandController.name, "fetch")

        super.send(res, brands, new HTTPStatus.SUCESS.OK)
    }

    public create(req: Request, res: Response) {

        let createBrandUseCase = new CreateBrandUseCase()

        let brandModel = Brand(super.ParsePayload(req.body.data))

        Logger.log(brandModel, BrandController.name, "create")

        createBrandUseCase.createBrand(brandModel, (error, task) => {

            if (error) {
                super.onError(res, new HTTPStatus.SERVER_ERROR.INTERNAL_SERVER_ERROR, error);
            }
            else {
                super.send(res, task, new HTTPStatus.SUCESS.CREATED)
            }
        })
    }


    public update(req: Request, res: Response) {

        let brandModel = Brand(super.ParsePayload(req.body.data))

        Logger.log(brandModel, BrandController.name, "update")

        let useCase = new UpdateBrandUseCase()

        useCase.update(brandModel, (error, model) => {

            if (error) {
                super.onError(res, new HTTPStatus.SERVER_ERROR.INTERNAL_SERVER_ERROR, error);
            }
            else {
                super.send(res, model, new HTTPStatus.SUCESS.OK)
            }
        })
    }


    public delete(req: Request, res: Response) {

        let useCase = new DeleteBrandUseCase()

        Logger.log(useCase, BrandController.name, "delete")

        useCase.delete(req.params.id, (error, model) => {

            if (error) {
                super.onError(res, new HTTPStatus.SERVER_ERROR.INTERNAL_SERVER_ERROR, error);
            }
            else {
                super.send(res, model, new HTTPStatus.SUCESS.OK)
            }
        })
    }
}