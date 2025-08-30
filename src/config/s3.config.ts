import { S3Client } from '@aws-sdk/client-s3';
import _config from './_config';

export const s3Client = new S3Client({
    region: _config.s3Region,

    credentials: {
        accessKeyId: _config.s3AccessKeyId,
        secretAccessKey: _config.s3SecretAccessKey,
    },
});
