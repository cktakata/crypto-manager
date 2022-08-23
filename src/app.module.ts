import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeyController } from './key-controller/key-controller.controller';
import { KeyService} from './key-service/key-service.service';
import { CryptoService } from './crypto-service/crypto-service.service';
import { UtilService } from './util-service/util.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task-service/task-service.service';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, KeyController],
  providers: [AppService, KeyService, CryptoService, UtilService, TaskService],
})
export class AppModule {}
