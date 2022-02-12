import { GithubWebhooksModule } from '@dev-thought/nestjs-github-webhooks';
import { ResponseDto } from '@lib/common-config/response.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationModule } from '@src/config.module';
import { plainToInstance } from 'class-transformer';
import { PushRepositoryDto } from './dto/push-repository.dto';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

describe('WebhookController', () => {
    let controller: WebhookController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                GithubWebhooksModule.forRoot({
                    webhookSecret: process.env.GIT_WEBHOOK_SECRET,
                }),
                ConfigurationModule,
            ],
            controllers: [WebhookController],
            providers: [WebhookService],
        }).compile();

        controller = module.get<WebhookController>(WebhookController);
    });

    it('/webhook test', () => {
        const testRequestData = {
            id: 458268058,
            node_id: 'R_kgDOG1Cdmg',
            name: 'GithubRaw-Backend',
            full_name: 'Heavyrisem/GithubRaw-Backend',
            private: false,
        };
        const requestDto = plainToInstance(PushRepositoryDto, testRequestData);
        expect(controller.withRestrictedGithubEvents(requestDto)).toStrictEqual(ResponseDto.OK());
    });
});
