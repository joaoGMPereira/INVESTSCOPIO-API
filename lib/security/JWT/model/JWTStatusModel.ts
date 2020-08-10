export class JWTStatusModel {

    valid: Boolean

    constructor(expired?: Boolean) {
        this.valid = expired
    }

}