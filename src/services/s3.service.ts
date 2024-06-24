// src/services/s3.service.ts

import { Injectable } from '@nestjs/common';
import { AwsConfigService } from '../config/aws.config';

@Injectable()
export class S3Service {
  constructor(private readonly awsConfigService: AwsConfigService) {}

  async uploadFile(bucketName: string, key: string, body: Buffer) {
    const s3 = this.awsConfigService.getS3Client();

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body,
    };

    return s3.upload(params).promise();
  }

  // Resto de operaciones con Amazon S3
}
