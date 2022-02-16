import GitManager from '@lib/git';
import { SavedRepository } from '@lib/git/commandExec';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
    // TODO: Module로 분리하여 1회만 실행되도록 변경
    private GitManager = GitManager([JSON.parse(process.env.GIT_REPOS), process.env.GIT_ROOT]);
    constructor() {
        console.log('WebHookService Created', this.GitManager);
    }

    gitPull(repoName: string) {
        return this.GitManager.pull(repoName);
    }

    getSavedRepository(repoName: string): SavedRepository | undefined {
        return this.GitManager.savedRepository[repoName];
    }
}
