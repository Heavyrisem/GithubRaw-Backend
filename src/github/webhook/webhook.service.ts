import GitManager from '@lib/git';
import { SavedRepository } from '@lib/git/commandExec';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
    private GitManager = new GitManager(JSON.parse(process.env.GIT_REPOS), process.env.GIT_ROOT);

    gitPull(repoName: string) {
        return this.GitManager.pull(repoName);
    }

    getSavedRepository(repoName: string): SavedRepository | undefined {
        return this.GitManager.savedRepository[repoName];
    }
}
