const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const {
  R2_ENDPOINT,
  R2_BUCKET,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
} = process.env;

let r2Client = null;

function getR2Client() {
  if (!R2_ENDPOINT || !R2_BUCKET || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 env vars are missing. Check R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.');
  }
  if (!r2Client) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }
  return r2Client;
}

async function getPresignedUploadUrl({ key, contentType, expiresIn = 900 }) {
  if (!key) throw new Error('key is required');
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ...(contentType ? { ContentType: contentType } : {}),
  });
  return getSignedUrl(getR2Client(), command, { expiresIn });
}

module.exports = {
  getPresignedUploadUrl,
};
