import { Test, TestingModule } from '@nestjs/testing';
import { RawController } from './raw.controller';
import * as fs from 'fs/promises';
import { normalize, resolve } from 'path';
import { ConfigurationModule } from '@src/config.module';
import { RawService } from './raw.service';

describe('RawController', () => {
    let controller: RawController;

    const dummytext = 'dummy text for file';
    const filename = '/controllerDummyfile';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigurationModule],
            controllers: [RawController],
            providers: [RawService],
        }).compile();

        controller = module.get<RawController>(RawController);
    });

    afterAll(async () => {
        await fs.unlink(normalize(resolve(process.env.GIT_ROOT) + filename));
    });

    it('/raw read test', async () => {
        await fs.writeFile(normalize(resolve(process.env.GIT_ROOT) + filename), dummytext);
        const readresult = await controller.readRawFile(filename);

        expect(readresult).toBe(`<pre>${dummytext}</pre>`);
    });
});
