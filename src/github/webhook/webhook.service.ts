import GitManager from '@lib/git';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
    private GitManager = new GitManager(JSON.parse(process.env.GIT_REPOS), process.env.GIT_ROOT);

    gitPull(repoName: string) {
        return this.GitManager.pull(repoName);
    }
}
