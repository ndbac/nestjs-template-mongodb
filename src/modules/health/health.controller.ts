import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import config from 'config';
import { ServiceMetadaDto } from './health.dto';

/**
 * health endpoints will be useful when deploying in a container orchestration cluster i.e K8s
 */
@Controller('health')
@ApiTags('health')
export class HealthController {
  /**
   * if possible, should check healthy of external dependent service: Mongo, Redis, RMQ,...
   * which is crucial to application
   */
  @Get('ready')
  @ApiOperation({
    operationId: 'probeServiceReady',
  })
  checkHealth() {
    return { msg: 'Hello world' };
  }

  @Get('service-metadata')
  @ApiOperation({
    operationId: 'getServiceMetadata',
  })
  @ApiOkResponse({
    type: ServiceMetadaDto,
  })
  getMetadata() {
    return config.get<any>('service');
  }
}
