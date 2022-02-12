declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: number;
            GIT_REPOS: string;
            GIT_ROOT: string;
            GIT_WEBHOOK_SECRET: string;
            NODE_ENV: 'dev' | 'prod' | 'test';
        }
    }
}
export {};
