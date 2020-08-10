import * as mongoose from 'mongoose';

import { HTTPStatus } from '../../models/http/HTTPStatus';

import { SimulationSchema } from '../../models/simulation/SimulationModel';

const Simulation = mongoose.model('Simulation', SimulationSchema);

export class UpdateSimulationUseCase {

    public update(simulationModel: typeof SimulationSchema, callback) {

        Simulation.findOneAndUpdate({ _id: simulationModel._id }, simulationModel, { new: true }, (error, model) => {
            if (error) {
                return callback(error, new HTTPStatus.CLIENT_ERROR.BAD_REQUEST);
            }
            else {
                return callback(undefined, model);
            }
        });
    }
} 