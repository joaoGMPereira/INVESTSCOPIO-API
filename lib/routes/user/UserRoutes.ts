
import { BaseRouter } from "../base/BaseRouter"
import { UserController } from "../../controllers/user/UserController";

export class UserRoutes extends BaseRouter {

    private app: any
    private root: String
    private userController: UserController = new UserController();

    constructor(app: any, root: String) {
        super();
        this.app = app
        this.root = root
        this.get()
        this.find()
        this.create()
        this.update()
        this.delete()
    }

    private get() {
        this.app.route(this.root + "v1" + '/user').get(super.sessionControl(), this.userController.get)
    }

    private find() {
        this.app.route(this.root + "v1" + '/user/:id').get(super.sessionControl(), this.userController.find)
    }

    private create() {
        this.app.route(this.root + "v1" + '/user/:id').post(super.sessionControl(), this.userController.create)
    }

    private update() {
        this.app.route(this.root + "v1" + '/user/:id').put(super.sessionControl(), this.userController.update)
    }

    private delete() {
        this.app.route(this.root + "v1" + '/user/:id').delete(super.sessionControl(), this.userController.delete)
    }

}