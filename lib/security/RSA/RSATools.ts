const NodeRSA = require('node-rsa');
const ALGORITHM = 'pkcs1'
const PUBLIC_KEY_FORMT = 'pkcs8-public-pem'
const STANDAR_ENCRYPT_ENCODE = 'base64'
const STANDARD_DECRYPT_FORMAT = 'json'

const RSAKey = new NodeRSA({
    b: 2048
});

RSAKey.setOptions({ encryptionScheme: ALGORITHM });

export class RSATools {

    public publicKey() {
        return RSAKey.exportKey(PUBLIC_KEY_FORMT);
    }

    public encrypt(data: String) {
        return RSAKey.encrypt(data, STANDAR_ENCRYPT_ENCODE);
    }

    public decrypt(data: String, format?: String) {
        if (format == null) {
            format = STANDARD_DECRYPT_FORMAT
        }
        return RSAKey.decrypt(data, format);
    }

}