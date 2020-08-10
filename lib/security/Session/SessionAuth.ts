import { CryptoTools } from "../CryptoTools";
import { JWTType } from "../JWT/model/JWTType"
import { HTTPResponse } from "../../models/http/HTTPResponse"
import { HTTPStatus } from "../../models/http/HTTPStatus"
import { Environment } from "../../tools/Environment";

module.exports = (req, res, next) => {

  const token = req.headers['access-token'] || req.headers['session-token'];

  console.log("token: " + token);
  if (Environment.Instance.isProduction || token != null) {
    try {
      var decodedToken = CryptoTools.JWT().decodeToken(token)
    } catch (error) {
      console.log("Verify Error: " + error)
      return res.status(401).send(new HTTPResponse(undefined, new HTTPStatus.CLIENT_ERROR.UNAUTHORIZED));
    }

    console.log("is login: " + token && String(req.originalUrl).includes('login'))

    console.log("Token: " + JSON.stringify(token))

    if (token && decodedToken.type == JWTType.ACCESS && (String(req.originalUrl).includes('login') ||  String(req.originalUrl).includes('register'))) {
      req.params.access = JSON.parse(JSON.stringify(decodedToken));
      next();
    } else if (token && decodedToken.type == JWTType.SESSION) {
      req.params.session = decodedToken;
      next();
    }
    else {
      return res.status(403).send(new HTTPResponse(undefined, new HTTPStatus.CLIENT_ERROR.FORBIDDEN));
    }
  } else {
    next()
  }
}