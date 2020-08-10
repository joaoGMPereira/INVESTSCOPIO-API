import * as mongoose from 'mongoose';

import { Logger } from '../../tools/Logger'

import { SimulationSchema } from '../../models/simulation/SimulationModel';

const Simulation = mongoose.model('Simulation', SimulationSchema);

export class CreateSimulationUseCase {

    public createSimulation(simulationModel : typeof SimulationSchema, callback) {

        simulationModel.save((error, simulationModel) => {

            if (error) {
                Logger.log(error, CreateSimulationUseCase.name, "createSimulation")
                return callback(error, undefined)
            }
            else {
                return callback(undefined, simulationModel)
            }
        })
    }
} 