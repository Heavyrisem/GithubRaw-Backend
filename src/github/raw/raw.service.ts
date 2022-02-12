import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as Path from 'path';

@Injectable()
export class RawService {
    readFile(path: string): Promise<string> {
        return fs.readFile(Path.normalize(Path.resolve(process.env.GIT_ROOT) + path)).then((res) => res.toString());
    }
}
