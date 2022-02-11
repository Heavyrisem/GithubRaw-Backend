import { Module } from '@nestjs/common';
import { RawModule } from './raw/raw.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
    imports: [WebhookModule, RawModule],
})
export class GithubModule {}
