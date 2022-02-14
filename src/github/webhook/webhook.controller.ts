import { GithubGuard, GithubWebhookEvents } from '@dev-thought/nestjs-github-webhooks';
import { ResponseDto } from '@lib/common-config/response.dto';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PushRepositoryDto } from './dto/push-repository.dto';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}

    @UseGuards(GithubGuard)
    @GithubWebhookEvents(['push'])
    @Post()
    withRestrictedGithubEvents(@Body('ref') ref: string, @Body('repository') repository: PushRepositoryDto) {
        // TODO: ref 확인해서 목표 브랜치가 아니라면 무시
        const pullResult = this.webhookService.gitPull(repository.name);

        if (pullResult === true) {
            return ResponseDto.OK();
        } else {
            throw ResponseDto.ERROR_WITH_DATA('Cannot update local repository', HttpStatus.INTERNAL_SERVER_ERROR, pullResult);
        }
    }
}
