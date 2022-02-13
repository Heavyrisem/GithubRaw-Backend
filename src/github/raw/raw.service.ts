import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { normalize, resolve } from 'path';

@Injectable()
export class RawService {
    readFile(path: string): Promise<string> {
        return fs.readFile(resolve(process.env.GIT_ROOT, normalize(path))).then((res) => res.toString());
    }
}
