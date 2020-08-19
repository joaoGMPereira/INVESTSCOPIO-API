
import { BaseRouter } from "../base/BaseRouter"
import { SimulationController } from "../../controllers/simulation/SimulationController";

export class SimulationRouter extends BaseRouter {

    private app: any
    private root: String
    private controller: SimulationController = new SimulationController();

    constructor(app: any, root: String) {
        super()
        this.app = app
        this.root = root
        this.get()
        this.fetch()
        this.create()
        this.delete()
        this.update()
    }

    private fetch() {
        this.app.route(this.root + "v1" + '/userSimulations').get(super.sessionControl(), this.controller.fetchUserSimulations)
    }

    private get() {
        this.app.route(this.root + "v1" + '/simulation/:id').get(this.controller.get)
    }

    private create() {
        this.app.route(this.root + "v1" + '/simulation').post(this.controller.create)
    }

    private delete() {
        this.app.route(this.root + "v1" + '/simulation/:id').delete(this.controller.delete)
    }

    private update() {
        this.app.route(this.root + "v1" + '/simulation').put(this.controller.update)
    }
}