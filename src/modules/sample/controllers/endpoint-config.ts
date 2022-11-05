import { IEndpointConfiguration } from 'src/shared/types';
import { SampleResponseDto } from '../dto/sample.dto';
import { HttpStatus } from '@nestjs/common';

export enum ESampleOperation {
  SAMPLE_ACTIONS = 'sampleAction',
}

export const SAMPLE_ENDPOINT_CONFIG: Record<
  ESampleOperation,
  IEndpointConfiguration
> = {
  [ESampleOperation.SAMPLE_ACTIONS]: {
    operationId: ESampleOperation.SAMPLE_ACTIONS,
    summary: 'Sample summary',
    body: {
      type: SampleResponseDto,
    },
    responses: [
      {
        type: [SampleResponseDto],
        status: HttpStatus.OK,
      },
    ],
  },
};
