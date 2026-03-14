import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

export const envConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  validationSchema: Joi.object({
    DB_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),

    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.string().required(),

    APP_PORT: Joi.number().required(),
  }),
};
