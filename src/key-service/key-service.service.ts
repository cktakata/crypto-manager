import { Injectable } from '@nestjs/common';
import { CryptoService } from '../crypto-service/crypto-service.service';
import * as redis from 'redis';

@Injectable()
export class KeyService {

    private redisClient: any

    constructor(private readonly cryptoService: CryptoService) {   
        const { env: { REDIS: redisURL } } = process
        this.redisClient = redis.createClient({
            url: `redis://${redisURL}`
        })

        this.redisClient.on('error', (err) => {
            console.log(err)
            console.log('Error occurred while connection or accessing redis server')
        })

        this.redisClient.connect()
    }

    private async generateKeys(): Promise<any> {
        if(!await this.redisClient.hGetAll('keyPair')){
            const { publicKey, privateKey } = await this.cryptoService.generateKeys()
            await this.redisClient.hSet('keyPair', { publicKey, privateKey }, { EX: 60 })
            return { publicKey, privateKey }
        } else {
            const { publicKey, privateKey } = await this.redisClient.hGetAll('keyPair')
            return { publicKey, privateKey }
        }
    }

    async listKeys(): Promise<any[]> {
        const { promisify } = require('util');
        const ttl = promisify(this.redisClient.ttl).bind(this.redisClient);
        // const remaingTime = await ttl('keyPair');
        // console.log(remaingTime)
        return await this.redisClient.hGetAll('keyPair')
    }

    async getPublicKey(): Promise<any> {
        const { publicKey } = await this.generateKeys()
        return publicKey
    }
    
    async getPrivateKey(): Promise<any> {
        const { privateKey } = await this.generateKeys()
        return privateKey
    }

    async encrypt(data: string): Promise<string> {
        const { publicKey } = await this.generateKeys()
        return await this.cryptoService.encrypt(publicKey, JSON.stringify(data))
    }

    async decrypt(data: string): Promise<string> {
        const { privateKey } = await this.generateKeys()
        return await this.cryptoService.decrypt(privateKey, data)
    }
}
