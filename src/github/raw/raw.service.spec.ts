import { Test, TestingModule } from '@nestjs/testing';
import { RawService } from './raw.service';
import * as fs from 'fs/promises';
import { resolve } from 'path';
import { ConfigurationModule } from '@src/config.module';

describe('RawService', () => {
    let module: TestingModule;
    let service: RawService;

    const dummytext = 'dummy text for file';
    const filename = './serviceDummyfile';

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ConfigurationModule],
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
