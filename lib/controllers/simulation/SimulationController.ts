import * as mongoose from 'mongoose';
import { Request, Response } from "express";
import { HTTPStatus } from '../../models/http/HTTPStatus';

import { SimulationSchema } from '../../models/simulation/SimulationModel';

import { CryptoTools } from "../../security/CryptoTools";
import { JWTSession } from "../../security/JWT/model/JWTSession";
import { Logger } from '../../tools/Logger'

import { BaseController } from "../BaseController"

import { CreateSimulationUseCase } from "../../usecase/simulation/CreateSimulationUseCase"
import { DeleteSimulationUseCase } from "../../usecase/simulation/DeleteSimulationUseCase"
import { UpdateSimulationUseCase } from "../../usecase/simulation/UpdateSimulationUseCase"
import { FetchSimulationUseCase } from "../../usecase/simulation/FetchSimulationUserCase"
import { GetSimulationUseCase } from "../../usecase/simulation/GetSimulationUseCase"

const Simulation = mongoose.model('Simulation', SimulationSchema);

export class SimulationController extends BaseController {

    public async get(req: Request, res: Response) {

        let simulation = await new GetSimulationUseCase().get(req.params.id)

        Logger.log(simulation, SimulationController.name, "get")

        super.send(res, simulation, new HTTPStatus.SUCESS.OK)
    }

    public async fetchUserSimulations(req: Request, res: Response) {
        let userID = super.session(req).userID
        let simulations = await new FetchSimulationUseCase().fetch(userID)

        Logger.log(simulations, SimulationController.name, "fetch")

        super.send(res, simulations, new HTTPStatus.SUCESS.OK)
    }

    public create(req: Request, res: Response) {

        let createSimulationUseCase = new CreateSimulationUseCase()

        const token = super.session(req)
        let userData = CryptoTools.AES().decrypt(req.body.data, token)
        let simulationModel = Simulation(JSON.parse(userData))

        Logger.log(simulationModel, SimulationController.name, "createSimulation")
        let userID = super.session(req).userID
        createSimulationUseCase.createSimulation(userID, simulationModel, (error, task) => {
            if (error) {
                super.onError(res, new HTTPStatus.SERVER_ERROR.INTERNAL_SERVER_ERROR, error);
            }
            else {
                super.send(res, task, new HTTPStatus.SUCESS.CREATED)
            }
        })
    }


    public update(req: Request, res: Response) {

        let simulationModel = Simulation(super.ParsePayload(req.body.data))

        Logger.log(simulationModel, SimulationController.name, "update")

        let useCase = new UpdateSimulationUseCase()

        useCase.update(simulationModel, (error, model) => {

            if (error) {
                super.onError(res, new HTTPStatus.SERVER_ERROR.INTERNAL_SERVER_ERROR, error);
            }
            else {
                super.send(res, model, new HTTPStatus.SUCESS.OK)
            }
        })
    }


    public delete(req: Request, res: Response) {

        let useCase = new DeleteSimulationUseCase()

        Logger.log(useCase, SimulationController.name, "delete")

        useCase.delete(req.params.id, (error, model) => {

            if (error) {
                super.onError(res, new HTTPStatus.SERVER_ERROR.INTERNAL_SERVER_ERROR, error);
            }
            else {
                super.send(res, model, new HTTPStatus.SUCESS.OK)
            }
        })
    }

    public deleteAll(req: Request, res: Response) {

        let useCase = new DeleteSimulationUseCase()

        Logger.log(useCase, SimulationController.name, "deleteAll")
        let userID = super.session(req).userID
        useCase.deleteAll(userID, (error, model) => {
            if (error) {
                super.onError(res, new HTTPStatus.SERVER_ERROR.INTERNAL_SERVER_ERROR, error);
            }
            else {
                super.send(res, model, new HTTPStatus.SUCESS.OK)
            }
        })
    }
}