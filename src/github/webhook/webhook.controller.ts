import { GithubGuard, GithubWebhookEvents } from '@dev-thought/nestjs-github-webhooks';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
    @UseGuards(GithubGuard)
    @GithubWebhookEvents(['push'])
    @Post()
    withRestrictedGithubEvents(@Body() payload) {
        console.log(payload);
    }
}
