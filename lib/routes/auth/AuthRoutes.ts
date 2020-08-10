
import { BaseRouter } from "../base/BaseRouter"
import { AuthController } from "../../controllers/auth/AuthController";

export class AuthRoutes extends BaseRouter {

    private app: any
    private root: String
    private authController: AuthController = new AuthController();

    constructor(app: any, root: String) {
        super();
        this.app = app
        this.root = root
        this.register()
        this.login()
        this.publicKey()
        this.accessToken()
        this.validateToken()
    }

    private publicKey() {
        this.app.route(this.root +  "v1" + '/public-key').get(this.authController.publicKey)
    }

    private accessToken(){
        this.app.route(this.root +  "v1" + '/access-token').post(this.authController.accessToken)
    }

    private validateToken(){
        this.app.route(this.root +  "v1" + '/token-status/:id').get(this.authController.validateToken)
    }

    private login(){
        this.app.route(this.root +  "v1" + '/login').post(super.sessionControl(), this.authController.login)
    }

    private register(){
        this.app.route(this.root +  "v1" + '/register').post(super.sessionControl(), this.authController.register)
    }
}