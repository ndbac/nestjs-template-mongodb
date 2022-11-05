import { Module } from '@nestjs/common';
import { SampleModule } from './sample/sample.module';
import { HealthModule } from './health/health.module';
import { MongoDBModule } from '../adapters/mongodb/mongo-db.module';

@Module({
  imports: [MongoDBModule.forMongo(), HealthModule, SampleModule],
})
export class AppModule {}
