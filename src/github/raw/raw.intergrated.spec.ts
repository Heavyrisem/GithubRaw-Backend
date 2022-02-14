import { Test, TestingModule } from '@nestjs/testing';
import { RawController } from './raw.controller';
import * as fs from 'fs/promises';
import { resolve } from 'path';
import { ConfigurationModule } from '@src/config.module';
import { RawService } from './raw.service';
import { WebhookService } from '../webhook/webhook.service';

describe('Raw', () => {
    afterAll(async () => {
        await fs.rm(resolve(process.env.GIT_ROOT), { recursive: true, force: true });
    });

    describe('RawController', () => {
        let module: TestingModule;
        let controller: RawController;

        const dummytext = 'dummy text for file';
        const filename = './controllerDummyfile';

        beforeAll(async () => {
            module = await Test.createTestingModule({
                imports: [ConfigurationModule, WebhookService],
                controllers: [RawController],
                providers: [RawService],
            }).compile();

            controller = module.get<RawController>(RawController);
        });

        afterAll(async () => {
            await fs.unlink(resolve(process.env.GIT_ROOT, filename));
            module.close();
        });

        it('/raw read test', async () => {
            await fs.writeFile(resolve(process.env.GIT_ROOT, filename), dummytext);
            const readresult = await controller.readRawFile(filename);

            expect(readresult).toBe(`<pre>${dummytext}</pre>`);
        });
    });

    describe('RawService', () => {
        let module: TestingModule;
        let service: RawService;

        const dummytext = 'dummy text for file';
        const filename = './serviceDummyfile';

        beforeAll(async () => {
            module = await Test.createTestingModule({
                imports: [ConfigurationModule, WebhookService],
                providers: [RawService],
            }).compile();

            service = module.get<RawService>(RawService);
        });

        afterAll(async () => {
            await fs.unlink(resolve(process.env.GIT_ROOT, filename));
            module.close();
        });

        it('file read test', async () => {
            await fs.writeFile(resolve(process.env.GIT_ROOT, filename), dummytext);
            const readresult = await service.readFile(filename);

            expect(readresult).toBe(dummytext);
        });
    });
});
