import { ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiPropertyOptional({ type: String })
  readonly errorCode?: string;

  @ApiPropertyOptional({ type: Number })
  readonly statusCode?: number;

  @ApiPropertyOptional({
    type: String,
    example: 'Error message',
    default: 'Internal Server Error',
  })
  readonly message?: string;
}
