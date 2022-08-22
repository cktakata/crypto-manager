import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService{

    constructor() {}

    async generateKeys() {
        const { publicKey, privateKey } = await crypto.generateKeyPairSync("rsa", {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
              },
              privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret'
              }
        });
        return { publicKey, privateKey }
    }

    async encrypt(publicKey: string, data: string) {
        const encryptedData = crypto.publicEncrypt(
            {
              key: publicKey,
              padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
              oaepHash: "sha256",
            },
            Buffer.from(data)
          );
        return encryptedData.toString("base64")
    }

    async decrypt(privateKey: string, data: string) {
        const decryptedData = crypto.privateDecrypt(
            {
              key: privateKey,
              padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
              oaepHash: "sha256",
              passphrase: 'top secret'
            },
            Buffer.from(data,"base64")
          );
        return decryptedData.toString()
    }
}
