import { Module } from '@nestjs/common';
import { RawService } from './raw.service';
import { RawController } from './raw.controller';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
    imports: [WebhookModule],
    providers: [RawService],
    controllers: [RawController],
})
export class RawModule {}
