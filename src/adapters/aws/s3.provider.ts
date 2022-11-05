import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { S3_TOKEN } from 'src/shared/provider-tokens';
import { IUploadFileToS3Input } from './types';

export const s3Provider = {
  provide: 'S3Token',
  // eslint-disable-next-line @typescript-eslint/require-await
  useFactory: async (): Promise<S3> => {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    return s3;
  },
};

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject(S3_TOKEN)
    private readonly s3: S3,
  ) {}

  async uploadFileToS3({ key, bucket, file }: IUploadFileToS3Input) {
    const res = await this.s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: file,
      })
      .promise();

    return {
      key: res.Key,
      s3Url: res.Location,
    };
  }
}
