import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class SampleResponseDto {
  @ApiProperty()
  sampleId: string;
}
