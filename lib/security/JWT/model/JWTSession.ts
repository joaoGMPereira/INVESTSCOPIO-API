import { JWTType } from "../model/JWTType"
import { DeviceType } from "../model/DeviceType"

export class JWTSession {
    
    uid: String
    userID: String
    AESIV: String
    AESKey: String
    AESSalt: String
    created: number
    type: JWTType
    deviceType: DeviceType

    constructor(clientAESData: any, type?: JWTType) {
        this.userID = clientAESData.id
        this.uid = clientAESData.uid
        this.AESIV = clientAESData.AESIV.replace(/(\r\n|\n|\r)/gm, "");
        this.AESKey = clientAESData.AESKey.replace(/(\r\n|\n|\r)/gm, "");
        this.AESSalt = clientAESData.AESSalt.replace(/(\r\n|\n|\r)/gm, "");
        this.deviceType = clientAESData.deviceType
        this.created = Date.now()
        this.type = type
    }

    public static devSessionToken(uid: String) {
        return {
            id:"",
            uid: uid,
            AESIV: "AESIVDev",
            AESKey:"AESKEYDev",
            AESSalt:"AESSATDev",
            deviceType:"AESDEVICETYPEDev"
        }
    }
}