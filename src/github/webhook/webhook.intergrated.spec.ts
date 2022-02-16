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
import * as fs from 'fs/promises';
import { PushRefDto } from './dto/push-ref.dto';
import { WebhookModule } from './webhook.module';

describe('Webhook', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigurationModule,
                GithubWebhooksModule.forRoot({
                    webhookSecret: process.env.GIT_WEBHOOK_SECRET,
                }),
                WebhookModule,
            ],
            controllers: [WebhookController],
        }).compile();
    });

    afterAll(async () => {
        await fs.rm(resolve(process.env.GIT_ROOT), { recursive: true, force: true });
    });

    describe('WebhookController', () => {
        let controller: WebhookController;

        beforeAll(async () => {
            controller = module.get<WebhookController>(WebhookController);
        });

        it('/webhook test', () => {
            const testRefDto = {
                ref: 'refs/heads/master',
            };
            const testRepositoryDto = {
                id: 458268058,
                node_id: 'R_kgDOG1Cdmg',
                name: 'GithubRaw-Backend',
                full_name: 'Heavyrisem/GithubRaw-Backend',
                private: false,
            };
            const refDto = plainToInstance(PushRefDto, testRefDto);
            const repositoryDto = plainToInstance(PushRepositoryDto, testRepositoryDto);
            expect(controller.withRestrictedGithubEvents(refDto, repositoryDto)).toStrictEqual(ResponseDto.OK());
        });
    });

    describe('WebhookService', () => {
        let service: WebhookService;

        beforeAll(async () => {
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
