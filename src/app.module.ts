import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config.module';
import { GithubModule } from './github/github.module';

@Module({
    imports: [ConfigurationModule, GithubModule],
})
export class AppModule {}
