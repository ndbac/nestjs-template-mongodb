import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleService {
  sample() {
    return { sampleId: '12323-sad23ds-323s32s' };
  }
}
