import { AuthRoutes } from "./auth/AuthRoutes"
import { NPSRoutes } from "./nps/NPSRoutes";
import { UserRoutes } from "./user/UserRoutes";
import { BrandRouter } from "./brand/brandRouter";

const ROOT = "/api/"

export class Router {

    public routes(app): void {
        new AuthRoutes(app, ROOT)
        new NPSRoutes(app, ROOT)
        new UserRoutes(app, ROOT)
        new BrandRouter(app, ROOT)
    }
}