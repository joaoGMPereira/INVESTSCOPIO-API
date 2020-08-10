import * as mongoose from 'mongoose';

import { SimulationSchema } from '../../models/simulation/SimulationModel';

const Simulation = mongoose.model('Simulation', SimulationSchema);


export class GetSimulationUseCase {

     async get(id) {
        return await Simulation.findOne({ _id: id }).exec()
    }
} 