import * as mongoose from 'mongoose';

import { Logger } from '../../tools/Logger'

import { SimulationSchema } from '../../models/simulation/SimulationModel';
import { Simulated } from '../../models/simulation/SimulatedModel';
import { UpdateSimulationUseCase } from './UpdateSimulationUseCase';

const Simulation = mongoose.model('Simulation', SimulationSchema);

export class CreateSimulationUseCase {

    totalMonths = 0
    profitability: number = 0
    totalValue: number = undefined
    lastRescue: number = undefined
    lastProfitabilityUntilNextIncreaseRescue: number = 0

    public createSimulation(userID: String, simulationModel: typeof SimulationSchema, callback) {
        this.clearData()
        Logger.log("total months: " + this.totalMonths + " profitability: " + this.profitability + " totalValue: " + this.totalValue + " lastRescue: " + this.lastRescue + " lastProfitabilityUntilNextIncreaseRescue: " + this.lastProfitabilityUntilNextIncreaseRescue, CreateSimulationUseCase.name, "clearSimulation")
        simulationModel.userID = userID
        var simulatedValues = new Array<Simulated>()

        this.totalMonths = simulationModel.totalMonths
        this.lastProfitabilityUntilNextIncreaseRescue = this.saveInitialProfitabilityUntilNextIncreaseRescue(simulationModel)
        //simulatedValues.push(this.setInitialValueObject(simulationModel))

        if (this.totalMonths > 0) {
            for (var month = 1; month <= this.totalMonths; month++) {
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
        if (simulationModel._id != undefined) {
            let updateUserCase = new UpdateSimulationUseCase()
            updateUserCase.update(simulationModel, (error, task) => {
                if (error) {
                    Logger.log(error, CreateSimulationUseCase.name, "createSimulation")
                    return callback(error, undefined)
                }
                else {
                    return callback(undefined, simulatedValues)
                }
            })
            return
        }
        simulationModel.save((error, simulationModel) => {
            if (error) {
                Logger.log(error, CreateSimulationUseCase.name, "createSimulation")
                return callback(error, undefined)
            }
            else {
                return callback(undefined, simulatedValues)
            }
        })
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
                let nextRescue = nextGoalRescue + increaseRescue
                if (nextRescue < this.profitability) {
                    nextGoalRescue = nextRescue
                }
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