import { BaseRepository, GetRepoNameFromURL, SavedRepository } from '@lib/git/commandExec';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationModule } from '@src/config.module';
import { resolve } from 'path';
import { WebhookService } from './webhook.service';

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
