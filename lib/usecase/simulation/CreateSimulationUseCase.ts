import * as mongoose from 'mongoose';

import { Logger } from '../../tools/Logger'

import { SimulationSchema } from '../../models/simulation/SimulationModel';
import { Simulated } from '../../models/simulation/SimulatedModel';

const Simulation = mongoose.model('Simulation', SimulationSchema);

export class CreateSimulationUseCase {

    totalMonths = 0
    profitability: number = 0
    totalValue: number = undefined
    lastRescue: number = undefined
    lastProfitabilityUntilNextIncreaseRescue: number = 0

    public createSimulation(userID: String, simulationModel: typeof SimulationSchema, callback) {
        this.clearData()
        simulationModel.userID = userID
        var simulatedValues = new Array<Simulated>()

        this.totalMonths = simulationModel.totalMonths
        this.lastProfitabilityUntilNextIncreaseRescue = this.saveInitialProfitabilityUntilNextIncreaseRescue(simulationModel)
        simulatedValues.push(this.setInitialValueObject(simulationModel))

        if (this.totalMonths > 0) {
            for (var month = 1; month < this.totalMonths; month++) {
                let monthValue = simulationModel.monthValue
                this.profitability = this.checkProfitability(simulationModel)
                this.totalValue = this.checkTotalValue(simulationModel, this.profitability)
                this.lastRescue = this.checkRescue(simulationModel, this.profitability, month, this.lastRescue, this.lastProfitabilityUntilNextIncreaseRescue)
                if(this.lastRescue == undefined) {
                    this.lastRescue = 0
                }
                let updatedTotalTotalWithRescue = this.updateTotalValue(this.lastRescue, simulationModel)
                let simulatedValue = new Simulated(month, monthValue, this.profitability, this.lastRescue, updatedTotalTotalWithRescue)
                simulatedValues.push(simulatedValue)
            }
        }
        Logger.log(simulatedValues, CreateSimulationUseCase.name, "simulation")

        // simulationModel.save((error, simulationModel) => {

        //     if (error) {
        //         Logger.log(error, CreateSimulationUseCase.name, "createSimulation")
        //         return callback(error, undefined)
        //     }
        //     else {
        //         return callback(undefined, simulationModel)
        //     }
        // })
    }

     private clearData() {
        this.totalMonths = 0
        this.profitability = 0
        this.totalValue = undefined
        this.lastRescue = undefined
        this.lastProfitabilityUntilNextIncreaseRescue = 0
    }
        

    // Salvar primeira rentabilidade
    private saveInitialProfitabilityUntilNextIncreaseRescue(simulation: typeof SimulationSchema) {
        let firstProfitability = (simulation.initialValue * (simulation.interestRate)) / 100
        return firstProfitability
    }

    // Mes da Aplicacao Inicialx
    private setInitialValueObject(simulation: typeof SimulationSchema) {
        return new Simulated(undefined, simulation.monthValue, undefined, undefined, simulation.initialValue)
    }

    // Calcular Rendimento
    private checkProfitability(simulation: typeof SimulationSchema) {
        var profitability = 0.0
        let lastTotalValue = this.getLastTotalValue(simulation)
        profitability = (lastTotalValue * (simulation.interestRate))/100
        return profitability
    }

    //MARK: Calcular Valor Total Com Rendimento
    private checkTotalValue(simulation: typeof SimulationSchema, profitability: number) {
        let lastTotalValue = this.getLastTotalValue(simulation)
        let totalValueUpdated = lastTotalValue + profitability + (simulation.monthValue)
        return totalValueUpdated
    }

    // Salvar o valor Inicial e pegar o valor atualizado
    private getLastTotalValue(simulation: typeof SimulationSchema) {
        var lastTotalValue = simulation.initialValue

        if (this.totalValue) {
            lastTotalValue = this.totalValue
        }

        return lastTotalValue
    }

    //MARK: Verificar proximo resgate
    private checkRescue(simulation: typeof SimulationSchema, profitability: number, month: number, rescue?: number, lastProfitabilityUntilNextIncreaseRescue?: number) {
        var lastRescue = simulation.initialMonthlyRescue

        if (rescue) {
            lastRescue = rescue
        }

        let lastTotalValueRetrieved = this.getLastTotalValue(simulation)

        lastRescue = this.checkGoalIncreaseRescue(simulation, profitability, lastTotalValueRetrieved, lastProfitabilityUntilNextIncreaseRescue, lastRescue, month)
        return lastRescue
    }

    //MARK: Verificar objetivo de regaste
    private checkGoalIncreaseRescue(simulation: typeof SimulationSchema, profitability: number, lastTotalValueRetrieved: number, lastProfitabilityUntilNextIncreaseRescue: number, lastRescue: number, month: number) {
        var increaseRescue = simulation.increaseRescue
        var updatedLastRescue = lastRescue
        let goalIncreaseRescue = simulation.goalIncreaseRescue
        let nextRescueIsHigherThanProfitability = this.checkIfRescueIsHigherThanProfitability(lastRescue, profitability)
        if (nextRescueIsHigherThanProfitability) {
            updatedLastRescue = nextRescueIsHigherThanProfitability
            return updatedLastRescue
        }
        let nextRescueWithoutGoal = this.checkNextGoalRescueWithoutGoalIncreaseRescue(updatedLastRescue, increaseRescue, goalIncreaseRescue, month)
        if (nextRescueWithoutGoal) {
            updatedLastRescue = nextRescueWithoutGoal
            return updatedLastRescue
        }
        var multiplierGoalIncreaseRescue = profitability - this.lastProfitabilityUntilNextIncreaseRescue/goalIncreaseRescue
        if (multiplierGoalIncreaseRescue < 1) {
            multiplierGoalIncreaseRescue = 1
        }
        let nextGoalRescue = lastProfitabilityUntilNextIncreaseRescue + (goalIncreaseRescue * multiplierGoalIncreaseRescue)
        increaseRescue = increaseRescue * multiplierGoalIncreaseRescue
        if (profitability >= nextGoalRescue) {
            updatedLastRescue = this.checkIfNextRescueWillBeBiggerThanProfitability(updatedLastRescue, increaseRescue,  profitability, nextGoalRescue)
        }

        return updatedLastRescue
    }

    //MARK: Verificar se o proximo resgate vai ser maior que a rentabilidade
    private checkIfNextRescueWillBeBiggerThanProfitability(updatedLastRescue: number, increaseRescue: number, profitability: number, nextGoalRescue: number) {
        var checkUpdatedLastRescue = updatedLastRescue
        let updatedLastRescueWithIncreaseRescue = checkUpdatedLastRescue + increaseRescue
        if (updatedLastRescueWithIncreaseRescue < profitability) {
            checkUpdatedLastRescue = updatedLastRescueWithIncreaseRescue
            this.lastProfitabilityUntilNextIncreaseRescue = nextGoalRescue
            this.lastRescue = checkUpdatedLastRescue
        }
        return checkUpdatedLastRescue
    }

    //MARK: Verificar proximo resgate sem proximo objetivo
    private checkIfRescueIsHigherThanProfitability(rescue: number, profitability: number) {
        if (rescue > profitability) {
            this.lastRescue = rescue
            return 0.0
        }
        return undefined
    }

    //MARK: Verificar proximo resgate sem proximo objetivo
    private checkNextGoalRescueWithoutGoalIncreaseRescue(rescue: number, increaseRescue: number, goalIncreaseRescue: number, month: number) {
        if (goalIncreaseRescue == 0) {
            var nextGoalRescue = rescue
            if (month != 1) {
                nextGoalRescue += increaseRescue
            }
            this.lastRescue = nextGoalRescue
            return nextGoalRescue
        }
        return undefined
    }

    //MARK: atualizar valor total com o resgate
    private updateTotalValue(rescue: number, simulation: typeof SimulationSchema) {

        var lastTotalValueRetrieved = 0
        if (this.totalValue) {
            lastTotalValueRetrieved = this.totalValue
        } else {
            simulation.initialValue
        }
        lastTotalValueRetrieved = lastTotalValueRetrieved - rescue
        this.totalValue = lastTotalValueRetrieved
        return lastTotalValueRetrieved
    }
}



// class SimulationService: SimulationServiceProtocol {

//     var totalMonths = 0
//     var profitability: Double = 0
//     var totalValue: Double? = nil
//     var lastRescue: Double? = nil
//     var lastProfitabilityUntilNextIncreaseRescue: Double = 0

//     func presentSimulationProjection(_ request: Request, newSimulation: Simulation) throws -> Future<[Simulated]> {
//         return try request.authorizedUser().flatMap { user in
//             var simulationWithUser = newSimulation
//             simulationWithUser.userID = user.id
//             return simulationWithUser
//                 .save(on: request).map({ (simulation) -> ([Simulated]) in
//                     self.clearData()
//                     var simulatedValues = [Simulated]()
//                     self.totalMonths = newSimulation.totalMonths
//                     self.lastProfitabilityUntilNextIncreaseRescue = self.saveInitialProfitabilityUntilNextIncreaseRescue(simulation: newSimulation)
//                     simulatedValues.append(self.setInitialValueObject(with: newSimulation))
//                     if self.totalMonths > 0 {
//                         for month in 1...self.totalMonths {
//                             let monthValue = newSimulation.monthValue
//                             self.profitability = self.checkProfitability(with: newSimulation, totalValue: self.totalValue)
//                             self.totalValue = self.checkTotalValue(with: newSimulation, profitability: self.profitability, totalValue: self.totalValue)
//                             self.lastRescue = self.checkRescue(with: newSimulation, profitability:self.profitability, month: month, rescue: self.lastRescue, lastProfitabilityUntilNextIncreaseRescue: self.lastProfitabilityUntilNextIncreaseRescue, lastTotalValue: self.totalValue)
//                             let updatedTotalTotalWithRescue = self.updateTotalValue(withRescue: self.lastRescue ?? 0, simulation: newSimulation)
//                             let simulatedValue = Simulated(id: nil, month: month, monthValue: monthValue, profitability: self.profitability, rescue: self.lastRescue, total: updatedTotalTotalWithRescue)
//                             simulatedValues.append(simulatedValue)
//                         }
//                     }
//                     return simulatedValues
//                 })

//             }
//         }

// extension SimulationService {

//     func clearData() {
//         totalMonths = 0
//         profitability = 0
//         totalValue = nil
//         lastRescue = nil
//         lastProfitabilityUntilNextIncreaseRescue = 0
//     }

//     //Salvar primeira rentabilidade
//     func saveInitialProfitabilityUntilNextIncreaseRescue(simulation: Simulation) -> Double  {
//         let firstProfitability = (simulation.initialValue * (simulation.interestRate))/100
//         return firstProfitability
//     }

//     //MARK: Mes da Aplicacao Inicial
//     private func setInitialValueObject(with simulation: Simulation) -> Simulated {
//         return Simulated(id: nil, month: nil, monthValue: simulation.monthValue, profitability: nil, rescue: nil, total: simulation.initialValue)
//     }

//     //MARK: Calcular Rendimento
//     private func checkProfitability(with simulation: Simulation, totalValue: Double?) -> Double {
//         var profitability = 0.0
//         let lastTotalValue = getLastTotalValue(with: simulation)
//         profitability = (lastTotalValue * (simulation.interestRate))/100
//         return profitability
//     }

//     //MARK: Calcular Valor Total Com Rendimento
//     private func checkTotalValue(with simulation: Simulation, profitability: Double, totalValue: Double?) -> Double {
//         let lastTotalValue = getLastTotalValue(with: simulation)
//         let totalValueUpdated = lastTotalValue + profitability + (simulation.monthValue)
//         return totalValueUpdated
//     }

//     //MARK: Salvar o valor Inicial e pegar o valor atualizado
//     private func getLastTotalValue(with simulation: Simulation) -> Double {
//         var lastTotalValue = simulation.initialValue

//         if let totalValueNotNill = self.totalValue {
//             lastTotalValue = totalValueNotNill
//         }

//         return lastTotalValue
//     }

//     //MARK: Verificar proximo resgate
//     private func checkRescue(with simulation: Simulation, profitability: Double, month: Int, rescue: Double?, lastProfitabilityUntilNextIncreaseRescue: Double, lastTotalValue: Double?) -> Double {
//         var lastRescue = simulation.initialMonthlyRescue

//         if let lastRescueNotNill = rescue {
//             lastRescue = lastRescueNotNill
//         }

//         let lastProfitabilityUntilNextIncreaseRescue = lastProfitabilityUntilNextIncreaseRescue
//         let lastTotalValueRetrieved = getLastTotalValue(with: simulation)

//         lastRescue = checkGoalIncreaseRescue(with: simulation, profitability: profitability, lastTotalValueRetrieved: lastTotalValueRetrieved, lastProfitabilityUntilNextIncreaseRescue: lastProfitabilityUntilNextIncreaseRescue, lastRescue: lastRescue, month: month)
//         return lastRescue
//     }

//     //MARK: Verificar objetivo de regaste
//     private func checkGoalIncreaseRescue(with simulation: Simulation, profitability: Double, lastTotalValueRetrieved: Double, lastProfitabilityUntilNextIncreaseRescue: Double, lastRescue: Double, month: Int) -> Double {
//         var increaseRescue = simulation.increaseRescue
//         var updatedLastRescue = lastRescue
//         let lastProfitabilityUntilNextIncreaseRescue = lastProfitabilityUntilNextIncreaseRescue
//         let goalIncreaseRescue = simulation.goalIncreaseRescue

//         if let nextRescueIsHigherThanProfitability = checkIfRescueIsHigherThanProfitability(rescue: lastRescue, profitability: profitability) {
//             updatedLastRescue = nextRescueIsHigherThanProfitability
//             return updatedLastRescue
//         }

//         if let nextRescueWithoutGoal = checkNextGoalRescueWithoutGoalIncreaseRescue(rescue: updatedLastRescue, increaseRescue: increaseRescue, goalIncreaseRescue: goalIncreaseRescue, month: month) {
//             updatedLastRescue = nextRescueWithoutGoal
//             return updatedLastRescue
//         }
//         var multiplierGoalIncreaseRescue = Int((profitability - lastProfitabilityUntilNextIncreaseRescue)/goalIncreaseRescue)
//         if multiplierGoalIncreaseRescue < 1 {
//             multiplierGoalIncreaseRescue = 1
//         }
//         let nextGoalRescue = lastProfitabilityUntilNextIncreaseRescue + (goalIncreaseRescue * Double(multiplierGoalIncreaseRescue))
//         increaseRescue = increaseRescue * Double(multiplierGoalIncreaseRescue)
//         if profitability >= nextGoalRescue {
//             updatedLastRescue = checkIfNextRescueWillBeBiggerThanProfitability(withUpdatedLastRescue: updatedLastRescue, increaseRescue: increaseRescue, profitability: profitability, nextGoalRescue: nextGoalRescue)
//         }

//         return updatedLastRescue
//     }

//     //MARK: Verificar se o proximo resgate vai ser maior que a rentabilidade
//     func checkIfNextRescueWillBeBiggerThanProfitability(withUpdatedLastRescue updatedLastRescue: Double, increaseRescue: Double, profitability: Double, nextGoalRescue: Double) -> Double {
//         var checkUpdatedLastRescue = updatedLastRescue
//         let updatedLastRescueWithIncreaseRescue = checkUpdatedLastRescue + increaseRescue
//         if updatedLastRescueWithIncreaseRescue < profitability {
//             checkUpdatedLastRescue = updatedLastRescueWithIncreaseRescue
//             self.lastProfitabilityUntilNextIncreaseRescue = nextGoalRescue
//             self.lastRescue = checkUpdatedLastRescue
//         }
//         return checkUpdatedLastRescue
//     }

//     //MARK: Verificar proximo resgate sem proximo objetivo
//     private func checkIfRescueIsHigherThanProfitability(rescue: Double, profitability: Double) -> Double? {
//         if rescue > profitability {
//             self.lastRescue = rescue
//             return 0.0
//         }
//         return nil
//     }

//     //MARK: Verificar proximo resgate sem proximo objetivo
//     private func checkNextGoalRescueWithoutGoalIncreaseRescue(rescue: Double, increaseRescue: Double, goalIncreaseRescue: Double, month: Int) -> Double? {
//         if goalIncreaseRescue == 0 {
//             var nextGoalRescue = rescue
//             if month != 1 {
//                 nextGoalRescue += increaseRescue
//             }
//             self.lastRescue = nextGoalRescue
//             return nextGoalRescue
//         }
//         return nil
//     }

//     //MARK: atualizar valor total com o resgate
//     private func updateTotalValue(withRescue rescue: Double, simulation: Simulation) -> Double {

//         var lastTotalValueRetrieved = self.totalValue ?? simulation.initialValue
//         lastTotalValueRetrieved = lastTotalValueRetrieved - rescue
//         self.totalValue = lastTotalValueRetrieved
//         return lastTotalValueRetrieved
//     }
// }
