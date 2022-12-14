import { Body, Controller, Delete, Get, Header, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { KeyService } from '../key-service/key-service.service';

@ApiTags('Public')
@Controller('key-controller')
export class KeyController {
    constructor(private readonly keyService: KeyService) {}

    @Get('/generate')
    @ApiOperation({ summary: 'Generate keys' })
    @ApiResponse( { status: 201, description: 'Generate keys' })
    @HttpCode(201)
    @Header('Content-type', 'application/json')
    async generateKeys(@Res() res: Response, @Req() req: Request): Promise<Response> {
        try {
            const qty = await this.keyService.generateKeys()
            return res.status(201).json(qty)
        } catch(e) {
        console.log(e.stack)
        throw new Error('Cannot generate keys')
        }
    }

    @Get('/list')
    @ApiOperation({ summary: 'Return all keys' })
    @ApiResponse( { status: 200, description: 'Return all keys' })
    @HttpCode(200)
    @Header('Content-type', 'application/json')
    async listKeys(@Res() res: Response, @Req() req: Request): Promise<Response> {
        try {
            const publicKey = await this.keyService.listKeys()
            return res.status(200).json(publicKey)
        } catch(e) {
        console.log(e.stack)
        throw new Error('Cannot list keys')
        }
    }

    @Delete('/delete')
    @ApiOperation({ summary: 'Delete all keys' })
    @ApiResponse( { status: 200, description: 'Delete all keys' })
    @HttpCode(200)
    @Header('Content-type', 'application/json')
    async deleteKeys(@Res() res: Response, @Req() req: Request): Promise<Response> {
        try {
            const publicKey = await this.keyService.deleteKeys()
            return res.status(200).json(publicKey)
        } catch(e) {
        console.log(e.stack)
        throw new Error('Cannot list keys')
        }
    }

    @Get('/get')
    @ApiOperation({ summary: 'Return Public Key' })
    @ApiResponse( { status: 200, description: 'Return Public Key' })
    @HttpCode(200)
    @Header('Content-type', 'application/json')
    async getPublicKey(@Res() res: Response, @Req() req: Request): Promise<Response> {
        try {
            const publicKey = await this.keyService.getPublicKey()
            return res.status(200).json(publicKey)
        } catch(e) {
        console.log(e.stack)
        throw new Error('Cannot get publicKey')
        }
    }

    @Post('/encrypt')
    @ApiOperation({ summary: 'Encrypt data' })
    @ApiResponse( { status: 200, description: 'Encrypt data' })
    @HttpCode(200)
    @Header('Content-type', 'application/json')
    async encrypt(@Res() res: Response, @Req() req: Request, @Body() body: any): Promise<Response> {
        try {
            const data = await this.keyService.encrypt(body)
            return res.status(200).json(data)
        } catch(e) {
        console.log(e.stack)
        throw new Error('Cannot encrypt data')
        }
    }

    @Post('/decrypt')
    @ApiOperation({ summary: 'Decrypt data' })
    @ApiResponse( { status: 200, description: 'Decrypt data' })
    @HttpCode(200)
    @Header('Content-type', 'application/json')
    async decrypt(@Res() res: Response, @Req() req: Request, @Body() body: any): Promise<Response> {
        try {
            const data = await this.keyService.decrypt(body.data)
            return res.status(200).json(JSON.parse(data))
        } catch(e) {
        console.log(e.stack)
        throw new Error('Cannot decrypt data')
        }
    }
}
