
const JWT = require('jsonwebtoken')
const generator = require('generate-password');

import { JWTSession } from "../JWT/model/JWTSession"
import { JWTType } from "../JWT/model/JWTType"

var key = generator.generate({
    length: 128,
    numbers: true
});

const sessionTokenLife = 43200 // 12 h
const accessTokenLife = 30 // 30 s

export class JWTTools {

    public instance(){
        console.log(key)
        return JWT
    }

    public signAccessToken(data: any) {
        try {
            console.log(key)
            return JWT.sign(JSON.parse(JSON.stringify(data)), key, { expiresIn: accessTokenLife })
        }
        catch (e) {
            console.log("JWT e: " + e);
            return null;
        }
    }

    public signSessionToken(data: any) {
        try {
            console.log(key)
            return JWT.sign(JSON.parse(JSON.stringify(data)), key, { expiresIn: sessionTokenLife })
        }
        catch (e) {
            console.log("JWT e: " + e);
            return null;
        }
    }

    public renewSessionToken(expiredToken : String){
        let decodedToken = this.decodeToken(expiredToken)
        let newToken = new JWTSession(decodedToken, JWTType.SESSION)
        return this.signSessionToken(newToken)
    }

    public decodeToken(token: String) {
        return JWT.verify(token, key)
    }

    public verify(token: String) {
        JWT.verify(token, function(error, decodedToken){
            if(error){
                return false
            }
            return true
        });
    }

}