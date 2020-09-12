import * as mongoose from 'mongoose';

import { HTTPStatus } from '../../models/http/HTTPStatus';

import { SimulationSchema } from '../../models/simulation/SimulationModel';
import { SimulationDelete } from '../../models/simulation/SimulationDelete';
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

    public deleteAll(userID: String, callback) {

        Simulation.remove({ userID: userID }, (error, model) => {
            if (error) {
                callback(error, new HTTPStatus.CLIENT_ERROR)
            }
            else {
                callback(undefined, new SimulationDelete(model.ok))
            }
        });
    }
} 