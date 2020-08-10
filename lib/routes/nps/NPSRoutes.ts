
import { BaseRouter } from "../base/BaseRouter"
import { NPSController } from "../../controllers/nps/NPSController";

export class NPSRoutes extends BaseRouter {

    private app: any
    private root: String
    private npsController: NPSController = new NPSController();

    constructor(app: any, root: String) {
        super()
        this.app = app
        this.root = root
        this.add()
        this.get()
        this.getWithID()
        this.update()
        this.delete()

    }

    private add() {
        this.app.route(this.root + "v1" + '/nps').post(super.sessionControl(), this.npsController.add)
    }

    private get() {
        this.app.route(this.root + "v1" + '/nps').get(super.sessionControl(), this.npsController.get)
    }

    private getWithID() {
        this.app.route(this.root + "v1" + '/nps/:npsID').get(super.sessionControl(), this.npsController.getWithID)
    }

    private update() {
        this.app.route(this.root + "v1" + '/nps/:npsID').post(super.sessionControl(), this.npsController.update)
    }


    private delete() {
        this.app.route(this.root + "v1" + '/nps/:npsID').delete(super.sessionControl(), this.npsController.delete)
    }
}