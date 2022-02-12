import * as fs from 'fs/promises';
import * as Path from 'path';
import { BaseRepository, CloneCommand, PullCommand, SavedRepository } from './commandExec';

interface savedRepository {
    [index: string]: SavedRepository | undefined;
}

class GitManager {
    savedRepository: savedRepository = {};

    constructor(private repoList: BaseRepository[], private root: string) {
        this.root = Path.resolve(root);
        this.init();
    }

    async init() {
        const rootExist = await this.existDir(this.root);

        if (rootExist) {
            await fs.rm(this.root, { recursive: true, force: true });
        }
        await fs.mkdir(this.root);

        for (const REPO of this.repoList) {
            const repo = CloneCommand(REPO.URL, this.root);
            this.savedRepository[repo.NAME] = repo;
        }
    }

    pull(repoName: string): boolean {
        const repo = this.savedRepository[repoName];

        if (repo) {
            return PullCommand(repo);
        } else {
            return false;
        }
    }

    private async existDir(path: string) {
        return fs
            .stat(path)
            .then((stat) => stat.isDirectory())
            .catch(() => false);
    }
}

export default GitManager;
