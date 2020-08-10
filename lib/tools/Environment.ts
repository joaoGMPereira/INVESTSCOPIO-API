export class Environment {
    private static _instance: Environment;
    private constructor() {
        //...
    }

    public static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }

    public isProduction =  process.env.PRODUCTION_ENV || false
}

const EnvironmentInstance = Environment.Instance;