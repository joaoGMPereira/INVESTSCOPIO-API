import * as mongoose from 'mongoose';

import { SimulationSchema } from '../../models/simulation/SimulationModel';

const Simulation = mongoose.model('Simulation', SimulationSchema);

export class FetchSimulationUseCase {

    async fetch(userID: String) {
        return await Simulation.find({userID: userID}).exec()
    }
} 