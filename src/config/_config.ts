import { config } from 'dotenv';
import { getEnv } from '../lib/utils/get-env';
config();

const _config = {
    port: getEnv('PORT', '5000'),
    env: getEnv('NODE_ENV', 'development'),
    jwtSecret: getEnv('JWT_SECRET', ''),
    jwtAccessSecret: getEnv('JWT_ACCESS_SECRET', ''),
    jwtRefreshSecret: getEnv('JWT_REFRESH_SECRET', ''),
    jwtEmailSecret: getEnv('JWT_EMAIL_SECRET', ''),
    jwtResetSecret: getEnv('JWT_RESET_SECRET', ''),
    clientURL: getEnv('CLIENT_URL', ''),
    corsOrigin: getEnv('CORS_ORIGIN', ['']),
    cookieSecret: getEnv('COOKIE_SECRET', ''),
    databaseURL: getEnv('DATABASE_URL', ''),
    smtpHost: getEnv('SMTP_HOST'),
    smtpPort: getEnv('SMTP_PORT', '587'),
    smtpUser: getEnv('SMTP_USER'),
    smtpPass: getEnv('SMTP_PASS'),
    smtpFrom: getEnv('SMTP_FROM'),
    s3Bucket: getEnv('AWS_S3_BUCKET', ''),
    s3Region: getEnv('AWS_S3_REGION', ''),
    s3AccessKeyId: getEnv('AWS_ACCESS_KEY_ID', ''),
    s3SecretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY', ''),
    s3Endpoint: getEnv('AWS_S3_ENDPOINT', ''),
};

export default _config;
