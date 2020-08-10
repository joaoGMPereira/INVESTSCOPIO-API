
import { JWTSession } from "../../security/JWT/model/JWTSession";

const Crypto = require('crypto');
const KEY_SIZE = 32
const ITERATIONS = 2048
const DIGEST = "sha1"
const CHARSET = "utf8"
const ENCODE = "base64"

export class AESTools {

    public encrypt(data: String, key: String, salt: String, iv: String) {

        console.log("\nCryptoUtil : encrypt\n");
        console.log("key: " + key)
        
        let saltCrypto = salt
        let keyCrypto = key
        let keySecret = Crypto.pbkdf2Sync(keyCrypto, saltCrypto, ITERATIONS, KEY_SIZE, DIGEST)
        let ivCrypto = iv
        let algorithm = 'aes-256-cbc'

        console.log('\n ---- CRYPTO -----')
        console.log('iv: ' + ivCrypto)
        console.log('key: ' + keyCrypto)
        console.log('salt: ' + saltCrypto)
        console.log('cipherData: ' + data)
        console.log('secretKey: ' + keySecret)
        console.log('algorithm: ' + algorithm)
        console.log('\n ---- CRYPTO -----\n')

        var cipher = Crypto.createCipheriv(algorithm, keySecret, ivCrypto);
        var crypted = cipher.update(data, CHARSET, ENCODE);
        crypted += cipher.final(ENCODE);
        return crypted;
    }

    public decrypt(data: String, token: JWTSession) {

        let saltCrypto = token.AESSalt
        let keyCrypto = token.AESKey
        let keySecret = Crypto.pbkdf2Sync(keyCrypto, saltCrypto, ITERATIONS, KEY_SIZE, DIGEST)
        let ivCrypto = token.AESIV
        let algorithm = 'aes-256-cbc'

        console.log("\nCryptoUtil : decrypt\n")
        console.log("token: " + JSON.stringify(token))
        console.log('\n ---- CRYPTO -----')
        console.log('iv: ' + ivCrypto)
        console.log('key: ' + keyCrypto)
        console.log('salt: ' + saltCrypto)
        console.log('cipherData: ' + data)
        console.log('secretKey: ' + keySecret)
        console.log('algorithm: ' + algorithm)
        console.log('\n ---- CRYPTO -----\n')

        var decipher = Crypto.createDecipheriv(algorithm, keySecret, ivCrypto)
        var dec = decipher.update(data, ENCODE, CHARSET)
        dec += decipher.final(CHARSET)
        return JSON.parse(JSON.stringify(dec))
    }
}