
export class BaseResponse {
    code: Number = 200
    status: String = "SUCCESS"

    constructor(status?: String, code?: Number) {
        if (code) {
            this.code = code
        }
        if (status) {
            this.status = status
        }
    }
}