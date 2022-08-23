import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { KeyService } from '../key-service/key-service.service';

@Injectable()
export class TaskService {

    constructor(private readonly keyService: KeyService) {}

    private readonly logger = new Logger(TaskService.name);

    @Cron(CronExpression.EVERY_30_SECONDS)
    handleCron() {
        this.keyService.generateKeys()
    }
}
