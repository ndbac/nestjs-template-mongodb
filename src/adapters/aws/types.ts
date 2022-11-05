export interface IUploadFileToS3Input {
  bucket: string;
  file: Buffer;
  key: string;
}
