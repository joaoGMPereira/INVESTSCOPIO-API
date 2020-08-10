import { AESTools } from "./AES/AESTools";
import { RSATools } from "./RSA/RSATools";
import { JWTTools } from "./JWT/JWTTools";

export class CryptoTools {

    private static aes: AESTools = new AESTools()
    private static rsa: RSATools = new RSATools()
    private static jwt: JWTTools = new JWTTools()

    public static AES(): AESTools {
        return this.aes
    }

    public static RSA(): RSATools {
        return this.rsa
    }

    public static JWT(): JWTTools {
        return this.jwt
    }
}