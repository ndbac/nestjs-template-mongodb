import { ApiProperty } from '@nestjs/swagger';

export class ServiceMetadaDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  docsBaseUrl: string;

  @ApiProperty()
  baseUrl: string;

  @ApiProperty({
    example: '1.1.0',
    description: 'Follow semantic versioning',
  })
  apiVersion: string;
}
