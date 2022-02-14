import { SpawnSyncOptions } from 'child_process';
import { sync } from 'cross-spawn';
import { parse, resolve } from 'path';

export interface BaseRepository {
    URL: string;
    BRANCH: string;
}

export interface SavedRepository extends BaseRepository {
    NAME: string;
    PATH: string;
}

export function CloneCommand(URL: string, PATH: string, BRANCH = 'master'): SavedRepository {
    const REPO: SavedRepository = {
        BRANCH: BRANCH || 'master',
        NAME: GetRepoNameFromURL(URL),
        PATH,
        URL,
    };

    const args = ['clone', REPO.URL, '-b', REPO.BRANCH, '--single-branch'];
    ExecuteCommand('git', args, { cwd: resolve(REPO.PATH) });

    return REPO;
}

export function PullCommand(REPO: SavedRepository) {
    if (process.env.NODE_ENV !== 'prod') return Boolean(REPO);

    const resetArgs = ['reset', '--hard', 'HEAD'];
    ExecuteCommand('git', resetArgs, { cwd: REPO.PATH });

    const pullArgs = ['pull'];
    ExecuteCommand('git', pullArgs, { cwd: REPO.PATH });

    return true;
}

export const GetRepoNameFromURL = (URL: string) => parse(URL).base;

function ExecuteCommand(command: string, args: string[], options: SpawnSyncOptions) {
    const ps = sync(command, args, options);

    if (ps.error) {
        console.log(ps);
        throw ps.error;
    } else if (ps.status !== 0) {
        throw new Error(`Non-zero Exit Code: ${ps.status}, ${command} ${args.join(' ')}`);
    } else {
        return ps;
    }
}
