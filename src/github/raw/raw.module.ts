import { Module } from '@nestjs/common';
import { RawService } from './raw.service';
import { RawController } from './raw.controller';

@Module({
    providers: [RawService],
    controllers: [RawController],
})
export class RawModule {}
