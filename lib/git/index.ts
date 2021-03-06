import * as fs from 'fs';
import * as Path from 'path';
import { BaseRepository, CloneCommand, PullCommand, SavedRepository } from './commandExec';

interface savedRepository {
    [index: string]: SavedRepository | undefined;
}

class GitManager {
    savedRepository: savedRepository = {};
    static instance: GitManager;

    constructor(private repoList: BaseRepository[], private root: string) {
        this.root = Path.resolve(root);

        const rootExist = this.existDir(this.root);

        if (rootExist) {
            fs.rmSync(this.root, { recursive: true, force: true });
        }
        fs.mkdirSync(this.root);

        for (const REPO of this.repoList) {
            const repo = CloneCommand(REPO.URL, this.root);
            this.savedRepository[repo.NAME] = repo;
        }
    }

    pull(repoName: string): boolean | string {
        const repo = this.savedRepository[repoName];

        try {
            return PullCommand(repo);
        } catch (err) {
            return err;
        }
    }

    private async existDir(path: string) {
        try {
            return fs.statSync(path).isDirectory();
        } catch (err) {
            return false;
        }
    }

    static getManager(options: ConstructorParameters<typeof GitManager>) {
        if (!GitManager.instance) {
            GitManager.instance = new GitManager(...options);
        }
        return GitManager.instance;
    }
}

export default GitManager.getManager;
