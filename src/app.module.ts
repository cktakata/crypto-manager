import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeyController } from './key-controller/key-controller.controller';
import { KeyService} from './key-service/key-service.service';
import { CryptoService } from './crypto-service/crypto-service.service';
import { UtilService } from './util-service/util.service';

@Module({
  imports: [],
  controllers: [AppController, KeyController],
  providers: [AppService, KeyService, CryptoService, UtilService],
})
export class AppModule {}
