import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SampleCoreModule } from './sample.core.module';
import { SampleService } from './providers/sample.service';
import { SampleController } from './controllers/sample.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports: [SampleCoreModule],
  providers: [SampleService],
  controllers: [SampleController],
})
export class SampleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(SampleController);
  }
}
