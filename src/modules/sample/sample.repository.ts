import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { SampleDocument } from './sample.model';

@Injectable()
export class SampleRepository
  extends BaseRepository<SampleDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.SAMPLES)
    model: Model<SampleDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
