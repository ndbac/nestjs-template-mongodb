import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { SampleDocument } from './sample.model';
import { SampleRepository } from './sample.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.SAMPLES,
        schema: SampleDocument.schema,
      },
    ]),
  ],
  providers: [SampleRepository],
  exports: [SampleRepository],
})
export class SampleCoreModule {}
