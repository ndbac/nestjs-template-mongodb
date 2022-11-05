import { Module } from '@nestjs/common';
import { AwsS3Service, s3Provider } from './s3.provider';

@Module({
  providers: [s3Provider, AwsS3Service],
  exports: [s3Provider, AwsS3Service],
})
export class AwsSdkModule {}
