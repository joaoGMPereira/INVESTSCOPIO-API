import { BaseResponse } from "./BaseResponse";
import { Status } from "./Status";

export class HTTPResponse {
    data: String
    message: String
    response: BaseResponse

    constructor(data?: any, HTTPStatus?: Status, message?: String) {
        if (data) {
            this.data = JSON.parse(JSON.stringify(data));
        }
        
        if (message) {
            this.message = message
        }

        if (HTTPStatus) {
            this.response = new BaseResponse(HTTPStatus.status(), HTTPStatus.code())
        }
        else{
            this.response = new BaseResponse()
        }
    }
}