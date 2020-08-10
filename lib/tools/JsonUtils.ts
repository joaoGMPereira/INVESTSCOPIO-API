import { CryptoTools } from "../security/CryptoTools"
import { JWTSession } from "../security/JWT/model/JWTSession"

export class JsonUtils {
    public static getJson(data: any) {
        var json = null
        try {
           json = JSON.parse(data);
        } catch (e) {
            return json
        }
        return json
    }

    public static isEncrypted(data: any, token: JWTSession) {
        try {
            CryptoTools.AES().decrypt(data, token)
        } catch (e) {
            return false
        }
        return true
    }
}