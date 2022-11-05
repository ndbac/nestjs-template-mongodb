import { SchemaFactory } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from '../../src/shared/mongoose/base.document';

describe('base document', () => {
  let mockCreateSchemaFn: jest.SpyInstance;
  beforeAll(() => {
    mockCreateSchemaFn = jest.spyOn(SchemaFactory, 'createForClass');
  });

  test('base document class', () => {
    class TestDoc extends BaseDocument {}
    TestDoc.schema;
    expect(mockCreateSchemaFn).toBeCalled();
  });

  test('embedded document class', () => {
    class TestEmbeddedDoc extends EmbeddedDocument {}
    TestEmbeddedDoc.schema;
    expect(mockCreateSchemaFn).toBeCalled();
  });
});
