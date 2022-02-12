import { Test, TestingModule } from '@nestjs/testing';
import { RawService } from './raw.service';
import * as fs from 'fs/promises';
import { normalize, resolve } from 'path';
import { ConfigurationModule } from '@src/config.module';

describe('RawService', () => {
    let service: RawService;

    const dummytext = 'dummy text for file';
    const filename = '/serviceDummyfile';

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigurationModule],
            providers: [RawService],
        }).compile();

        service = module.get<RawService>(RawService);
    });

    afterAll(async () => {
        await fs.unlink(normalize(resolve(process.env.GIT_ROOT) + filename));
    });

    it('file read test', async () => {
        await fs.writeFile(normalize(resolve(process.env.GIT_ROOT) + filename), dummytext);
        const readresult = await service.readFile(filename);

        expect(readresult).toBe(dummytext);
    });
});
