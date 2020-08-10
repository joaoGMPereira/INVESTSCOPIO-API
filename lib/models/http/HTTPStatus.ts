import { Status } from "./Status"

export class HTTPStatus {

    static BUSINESS = class {

        static TASKS_LIMIT_REACHED = class implements Status {

            code(): Number {
                return 422
            }

            status(): String {
                return "Tasks limit reached"
            }
        }

        static GROUPS_LIMIT_REACHED = class implements Status {

            code(): Number {
                return 422
            }

            status(): String {
                return "Groups limit reached"
            }
        }

        static DUPLICATED_REGISTER = class implements Status {

            code(): Number {
                return 422
            }

            status(): String {
                return "Duplicated Register"
            }
        }
    }

    static SUCESS = class {

        static OK = class implements Status {
            code(): Number {
                return 200
            }

            status() {
                return "OK"
            }
        }

        static CREATED = class implements Status {

            code(): Number {
                return 201
            }

            status(): String {
                return "Created"
            }
        }

        static ACCEPTED = class implements Status {

            code(): Number {
                return 202
            }

            status(): String {
                return "Accepted"
            }

        }
    }

    static CLIENT_ERROR = class {

        static BAD_REQUEST = class implements Status {
            code(): Number {
                return 400
            }

            status(): String {
                return "Bad Request"
            }
        }

        static UNAUTHORIZED = class implements Status {
            code(): Number {
                return 401
            }
            status(): String {
                return "Unauthorized"
            }
        }

        static FORBIDDEN = class implements Status {

            code(): Number {
                return 403
            }

            status(): String {
                return "Forbidden"
            }
        }
    }

    static SERVER_ERROR = class {

        static INTERNAL_SERVER_ERROR = class implements Status {

            code(): Number {
                return 500
            }

            status(): String {
                return "Internal Server Error"
            }
        }
    }
}


//         "NOT_FOUND": {
//             "code": 404,
//             "status": "Not Found"
//         }
//     },
//     "SERVER_ERROR": {
//         "INTERNAL_SERVER_ERROR": {
//             "code": 500,
//             "status": "Internal Server Error"
//         },
//         "NOT_IMPLEMENTED": {
//             "code": 501,
//             "status": "Not Implemented"
//         },
//         "BAD_GATEWAY": {
//             "code": 502,
//             "status": "Bad Gateway"
//         },
//         "SERVICE_UNAVAILABLE": {
//             "code": 503,
//             "status": "Service Unavailable"
//         },
//         "GATEWAY_TIMEOUT": {
//             "code": 504,
//             "status": "Gateway Timeout"
//         },
//         "INSUFFICIENT_STORAGE": {
//             "code": 507,
//             "status": "Insufficient Storage"
//         }
//     }
// }