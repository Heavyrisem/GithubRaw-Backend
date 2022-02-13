import { Test, TestingModule } from '@nestjs/testing';
import { RawController } from './raw.controller';
import * as fs from 'fs/promises';
import { normalize, resolve } from 'path';
import { ConfigurationModule } from '@src/config.module';
import { RawService } from './raw.service';

describe('RawController', () => {
    let module: TestingModule;
    let controller: RawController;

    const dummytext = 'dummy text for file';
    const filename = './controllerDummyfile';

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [ConfigurationModule],
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
