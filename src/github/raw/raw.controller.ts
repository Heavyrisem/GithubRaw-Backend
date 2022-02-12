import { ResponseDto } from '@lib/common-config/response.dto';
import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { Path } from '@decorator/path.decorator';
import { normalize } from 'path';
import { RawService } from './raw.service';

@Controller('raw')
export class RawController {
    constructor(private readonly rawService: RawService) {}

    @Get('*')
    @Post('*')
    async readRawFile(@Path('/raw') path: string) {
        const parsedPath = normalize(path);
        const raw = await this.rawService.readFile(parsedPath).catch((err) => {
            throw ResponseDto.ERROR_WITH_DATA(`Cannot Read ${parsedPath}`, HttpStatus.BAD_REQUEST, err);
        });

        return `<pre>${raw}</pre>`;
    }
}
