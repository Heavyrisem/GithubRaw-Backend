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
        const branch = ref.split('refs/heads/').pop();
        const repo = this.webhookService.getSavedRepository(repository.name);

        if (!repo) {
            throw ResponseDto.ERROR_WITH(`${repository.name} is not registerd Repository`, HttpStatus.BAD_REQUEST);
        }

        if (branch !== repo.BRANCH) {
            throw ResponseDto.ERROR_WITH(`${branch} is not registerd Branch`, HttpStatus.BAD_REQUEST);
        }
        const pullResult = this.webhookService.gitPull(repo.NAME);

        if (pullResult === true) {
            return ResponseDto.OK();
        } else {
            throw ResponseDto.ERROR_WITH_DATA('Cannot update local repository', HttpStatus.INTERNAL_SERVER_ERROR, pullResult);
        }
    }
}
