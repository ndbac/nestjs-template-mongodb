import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { IamNamespace } from 'src/shared/types';
import { SampleService } from '../providers/sample.service';
import { ESampleOperation, SAMPLE_ENDPOINT_CONFIG } from './endpoint-config';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('sample')
@ApiTags('sample')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @AuthEndpoint({
    namespaces: [IamNamespace.BLOG_ADMINS, IamNamespace.BLOG_WRITERS],
  })
  @EndpointConfig(SAMPLE_ENDPOINT_CONFIG[ESampleOperation.SAMPLE_ACTIONS])
  @Post()
  create() {
    return this.sampleService.sample();
  }
}
