import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

const GIT_REPOS_SCHEMA = Joi.custom((value, helpers) => {
    let object: string;
    try {
        object = JSON.parse(value);
    } catch (err) {
        throw new Error('Falid to Parse JSON env');
    }

    const schema = Joi.array()
        .items(
            Joi.object().keys({
                URL: Joi.string().required(),
                BRANCH: Joi.string().required(),
            }),
        )
        .required();
    const result = schema.validate(object);

    if (result.error) {
        throw result.error;
    }
    return value;
}).required();
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
                PORT: Joi.number().default(3000),
                GIT_REPOS: GIT_REPOS_SCHEMA,
            }),
        }),
    ],
})
export class ConfigurationModule {}
