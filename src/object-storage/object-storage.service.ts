import { InternalServerErrorException, Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

@Injectable()
export class ObjectStorageService {
  private readonly bucket = process.env.S3_BUCKET;
  private readonly endpoint = process.env.S3_ENDPOINT;
  private readonly s3Client: S3Client;

  constructor() {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const region = process.env.S3_REGION;

    if (
      !accessKeyId ||
      !secretAccessKey ||
      !region ||
      !this.endpoint ||
      !this.bucket
    ) {
      throw new InternalServerErrorException(
        'Не настроены переменные Object Storage',
      );
    }

    this.s3Client = new S3Client({
      region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
  }): Promise<string> {
    const extension = extname(file.originalname);
    const key = `desserts/${randomUUID()}${extension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${this.endpoint}/${this.bucket}/${key}`;
  }
}
