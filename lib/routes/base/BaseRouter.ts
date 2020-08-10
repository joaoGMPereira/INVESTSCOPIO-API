export class BaseRouter {

    public sessionControl() {
        const sessionAuth = require("../../security/Session/SessionAuth")
        return sessionAuth
    }

}