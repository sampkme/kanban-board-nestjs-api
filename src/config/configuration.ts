import * as Joi from 'joi';
import { join } from 'path';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  DATA_DIR: Joi.string().default('./data'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:5173'),
});

export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  dataDir: join(process.cwd(), process.env.DATA_DIR ?? './data'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173',
});
