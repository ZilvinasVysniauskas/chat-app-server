import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
    region: "eu-central-1",
    credentials: {
      accessKeyId: "AKIATRWDS2WY6NWHEWEM",
      secretAccessKey: "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",
    },
  });
const bucketName = 'chat-app-file-storage';

interface AwsUrlRequest {
    fileName: string;
    contentType: string;
}

export const generatePresignedUrl = async (request: AwsUrlRequest) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: request.fileName,
        ContentType: request.contentType,
        ACL: "public-read",
      });
      return getSignedUrl(s3, command, { expiresIn: 300 });
};

export const getFileUrl = async (fileName: string) => {
  console.log(fileName);
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    return getSignedUrl(s3, command, { expiresIn: 300 });
  };

