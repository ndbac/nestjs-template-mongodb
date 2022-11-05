import { Prop, Schema } from '@nestjs/mongoose';
import {
  EmbeddedDocument,
  BaseDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';

@Schema({ _id: false })
export class SampleEmddedDocument extends EmbeddedDocument {
  @Prop()
  id?: string;
}

@Schema(DefaultSchemaOptions)
export class SampleDocument extends BaseDocument {
  @Prop({ required: true })
  sampleId: string;

  @Prop({
    type: SampleEmddedDocument.schema,
  })
  credentials?: SampleEmddedDocument;
}
