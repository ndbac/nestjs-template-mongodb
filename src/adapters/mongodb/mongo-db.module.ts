import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseOptions } from 'src/shared/mongoose/helpers';

export class MongoDBModule {
  static forMongo(): DynamicModule {
    return MongooseModule.forRootAsync({
      useFactory: () => createMongooseOptions('db.mongodb.uri'),
    });
  }
}
