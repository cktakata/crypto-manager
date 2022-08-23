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

    private async checkKeys() {
        const { env: { TTL: expiration } } = process
        const { publicKey: keyA } = await this.redisClient.hGetAll('keyPairA')
        const { publicKey: keyB } = await this.redisClient.hGetAll('keyPairB')
        const ttl = await this.redisClient.ttl.bind(this.redisClient);
        let remaingTimeA;
        let remaingTimeB;
        if(keyA!==undefined) {
            remaingTimeA = await ttl('keyPairA');
        }
        if(keyB!==undefined) {
            remaingTimeB = await ttl('keyPairB');
        }
        if((remaingTimeA<0 || remaingTimeA===undefined) && (remaingTimeB<0 || remaingTimeB===undefined)) {
            const { publicKey: publicA, privateKey: privateA } = await this.cryptoService.generateKeys()
            await this.redisClient.hSet('keyPairA', { publicKey:publicA, privateKey:privateA })
            await this.redisClient.expire('keyPairA', parseFloat(expiration))
            const { publicKey: publicB, privateKey: privateB } = await this.cryptoService.generateKeys()
            await this.redisClient.hSet('keyPairB', { publicKey:publicB, privateKey:privateB })
            await this.redisClient.expire('keyPairB', parseFloat(expiration)*2)
            return 2
        }
        if(remaingTimeA<0 || remaingTimeA===undefined) {
            const { publicKey: publicA, privateKey: privateA } = await this.cryptoService.generateKeys()
            await this.redisClient.hSet('keyPairA', { publicKey:publicA, privateKey:privateA })
            await this.redisClient.expire('keyPairA', remaingTimeB+parseFloat(expiration))
            return 1
        }
        if(remaingTimeB<0 || remaingTimeB===undefined) {
            const { publicKey: publicB, privateKey: privateB } = await this.cryptoService.generateKeys()
            await this.redisClient.hSet('keyPairB', { publicKey:publicB, privateKey:privateB })
            await this.redisClient.expire('keyPairB', remaingTimeA+parseFloat(expiration))
            return 1
        }
        return 0
    }

    private async getKeys(): Promise<any> {
        const { publicKey: pubA, privateKey: privA } = await this.redisClient.hGetAll('keyPairA')
        const { publicKey: pubB, privateKey: privB } = await this.redisClient.hGetAll('keyPairB')
        const ttl = await this.redisClient.ttl.bind(this.redisClient);
        let remaingTimeA;
        let remaingTimeB;
        let exp = Number.MAX_SAFE_INTEGER
        if(pubA!==undefined) {
            remaingTimeA = await ttl('keyPairA');
        }
        if(pubB!==undefined) {
            remaingTimeB = await ttl('keyPairB');
        }

        const tmpArray = []
        if(remaingTimeA!==undefined || remaingTimeA>0){
            tmpArray.push({
                exp: remaingTimeA,
                publicKey: pubA,
                privateKey: privA
            })
        }
        if(remaingTimeB!==undefined || remaingTimeB>0 ) {
            tmpArray.push({
                exp: remaingTimeB,
                publicKey: pubB,
                privateKey: privB
            })
        }
        let rtnObj = {}
        tmpArray.map( (obj) => {
            if(obj.exp<exp) {
                exp = obj.exp
                rtnObj = obj
            }
        })
        return rtnObj
    }

    async generateKeys() {
        return await this.checkKeys()
    }

    async listKeys(): Promise<any[]> {
        const ttl = await this.redisClient.ttl.bind(this.redisClient);
        const remaingTimeA = await ttl('keyPairA');
        const remaingTimeB = await ttl('keyPairB');
        const { publicKey: pubA, privateKey: privA } = await this.redisClient.hGetAll('keyPairA')
        const { publicKey: pubB, privateKey: privB } = await this.redisClient.hGetAll('keyPairB')
        return [ { publicKey: pubA, exp: remaingTimeA }, { publicKey: pubB, exp: remaingTimeB } ]
    }

    async deleteKeys() {
        this.redisClient.del('keyPairA')
        this.redisClient.del('keyPairB')
        return
    }

    async getPublicKey(): Promise<any> {
        const { publicKey } = await this.getKeys()
        return publicKey
    }
    
    async getPrivateKey(): Promise<any> {
        const { privateKey } = await this.getKeys()
        return privateKey
    }

    async encrypt(data: string): Promise<string> {
        const { publicKey } = await this.getKeys()
        return await this.cryptoService.encrypt(publicKey, JSON.stringify(data))
    }

    async decrypt(data: string): Promise<string> {
        const { privateKey } = await this.getKeys()
        return await this.cryptoService.decrypt(privateKey, data)
    }
}
