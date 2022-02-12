import { GithubWebhooksModule } from '@dev-thought/nestjs-github-webhooks';
import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
    imports: [
        GithubWebhooksModule.forRoot({
            webhookSecret: 'SECRETDATA',
        }),
    ],
    controllers: [WebhookController],
    providers: [WebhookService],
})
export class WebhookModule {}
