import { INestApplication } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { GeneralExceptionFilter } from 'src/filters/general-exception.filter';
import supertest from 'supertest';
import { AppModule } from 'src/modules/app.module';
import * as helpers from 'src/shared/mongoose/helpers';
import express from 'express';
import { generalValidationPipe } from 'src/pipes/general-validation.pipe';

export const createRequestFunction = (app: INestApplication) =>
  async function request(
    url: string,
    {
      expected = 200,
      method = 'get',
      body,
      contentType = 'application/json',
      accept = 'application/json',
      attachment,
      query,
      accessToken = 'Token',
      headers,
    }: {
      expected?: number;
      method?: 'get' | 'post' | 'put' | 'delete';
      body?: any;
      contentType?: string;
      accept?: string;
      attachment?: {
        name: string;
        file: string;
      };
      accessToken?: string;
      query?: Record<string, any>;
      headers?: Record<string, any>;
    } = {},
  ) {
    const agent = supertest.agent(app.getHttpServer());
    const req = agent[method](url)
      .set('Accept', accept)
      .set('Authorization', `Bearer ${accessToken}`);
    if (attachment) {
      req.attach(attachment.name, attachment.file);
    }
    if (query) {
      req.query(query);
    }

    if (headers) {
      Object.keys(headers).forEach((key) => {
        req.set(key, headers[key]);
      });
    }

    const reqAfterSend = body
      ? req.set('Content-Type', contentType).send(body)
      : req;

    return reqAfterSend.expect(expected).then((res) => {
      return res;
    });
  };

export const initTestApp = async (
  overrides?: (testModule: TestingModuleBuilder) => TestingModuleBuilder,
  configuration?: { baseUrl?: string; overrideKms?: boolean },
): Promise<{
  app: INestApplication;
  db: MongoMemoryReplSet;
}> => {
  const db = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });
  const dbUrl = db.getUri();

  jest.spyOn(helpers, 'createMongooseOptions').mockImplementation(() => ({
    uri: dbUrl,
  }));

  let testBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (overrides) {
    testBuilder = overrides(testBuilder);
  }

  const fixture = await testBuilder.compile();

  const app = fixture.createNestApplication(undefined, { bodyParser: false });
  app.use(express.text({ type: 'text/plain' }));

  const logger = {
    error: jest.fn(),
  };

  app.useGlobalPipes(generalValidationPipe);
  app.useGlobalFilters(new GeneralExceptionFilter(logger as any));
  if (configuration?.baseUrl) {
    app.setGlobalPrefix(configuration.baseUrl);
  }
  await app.init();
  return {
    app,
    db,
  };
};
