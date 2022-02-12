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

export function CloneCommand(URL: string, PATH: string, BRANCH = 'master') {
    const REPO: SavedRepository = {
        BRANCH: BRANCH || 'master',
        NAME: parse(URL).name,
        PATH,
        URL,
    };

    const args = ['clone', REPO.URL, '-b', REPO.BRANCH, '--single-branch'];

    const ps = ExecuteCommand('git', args, {
        cwd: resolve(REPO.PATH),
    });

    return {
        ...REPO,
        output: ps.output,
    };
}

export function PullCommand(REPO: SavedRepository) {
    if (process.env.NODE_ENV !== 'prod') return true;
    const resetArgs = ['reset', '--hard', 'HEAD'];
    ExecuteCommand('git', resetArgs, { cwd: REPO.PATH });

    const pullArgs = ['pull'];
    ExecuteCommand('git', pullArgs, { cwd: REPO.PATH });

    return true;
}

function ExecuteCommand(command: string, args: string[], options: SpawnSyncOptions) {
    const ps = sync(command, args, options);

    if (ps.error) {
        throw ps.error;
    } else if (ps.status !== 0) {
        throw new Error(`Non-zero Exit Code: ${ps.status}, ${command} ${args.join(' ')}`);
    } else {
        return ps;
    }
}
