import * as mongoose from 'mongoose';

import { HTTPStatus } from '../../models/http/HTTPStatus';

import { SimulationSchema } from '../../models/simulation/SimulationModel';

const Simulation = mongoose.model('Simulation', SimulationSchema);

export class DeleteSimulationUseCase {

    public delete(id: String, callback) {

        Simulation.remove({ _id: id }, (error, model) => {
            if (error) {
                callback(error, new HTTPStatus.CLIENT_ERROR)
            }
            else {
                callback(undefined, model)
            }
        });
    }
} 