
import { BaseRouter } from "../base/BaseRouter"
import { BrandController } from "../../controllers/brand/BrandController";

export class BrandRouter extends BaseRouter {

    private app: any
    private root: String
    private controller: BrandController = new BrandController();

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
        this.app.route(this.root + "v1" + '/brand').get(this.controller.fetch)
    }

    private get() {
        this.app.route(this.root + "v1" + '/brand/:id').get(this.controller.get)
    }

    private create() {
        this.app.route(this.root + "v1" + '/brand').post(this.controller.create)
    }

    private delete() {
        this.app.route(this.root + "v1" + '/brand/:id').delete(this.controller.delete)
    }

    private update() {
        this.app.route(this.root + "v1" + '/brand').put(this.controller.update)
    }
}