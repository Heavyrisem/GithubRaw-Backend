import { GithubWebhooksModule } from '@dev-thought/nestjs-github-webhooks';
import { ResponseDto } from '@lib/common-config/response.dto';
import { BaseRepository, GetRepoNameFromURL, SavedRepository } from '@lib/git/commandExec';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationModule } from '@src/config.module';
import { plainToInstance } from 'class-transformer';
import { resolve } from 'path';
import { PushRepositoryDto } from './dto/push-repository.dto';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

describe('Webhook', () => {
    describe('WebhookController', () => {
        let controller: WebhookController;

        beforeAll(async () => {
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

    describe('WebhookService', () => {
        let service: WebhookService;

        beforeAll(async () => {
            const module: TestingModule = await Test.createTestingModule({
                imports: [ConfigurationModule],
                providers: [WebhookService],
            }).compile();

            service = module.get<WebhookService>(WebhookService);
        });

        describe('webhook service test', () => {
            const testRepository: SavedRepository = {
                ...(JSON.parse(process.env.GIT_REPOS).shift() as BaseRepository),
                PATH: resolve(process.env.GIT_ROOT),
                NAME: GetRepoNameFromURL((JSON.parse(process.env.GIT_REPOS).shift() as BaseRepository).URL),
            };
            let savedRepository: SavedRepository;

            it('getSavedRepository test', () => {
                savedRepository = service.getSavedRepository(GetRepoNameFromURL(testRepository.URL));
                expect(savedRepository).toStrictEqual(testRepository);
            });

            it('gitPull test', () => {
                expect(service.gitPull(savedRepository.NAME)).toBe(true);
            });
        });
    });
});
