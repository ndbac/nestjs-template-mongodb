import { INestApplication } from '@nestjs/common';
import config from 'config';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import fs from 'fs';

export function initializeSwaggerDoc(app: INestApplication) {
  const serviceName = config.get<string>('service.name');
  const serviceDesc = config.get<string>('service.description');
  const docsBaseUrl = config.get<string>('service.docsBaseUrl');
  const apiVersion = config.get<string>('service.apiVersion');
  const docsUsername = config.get<string>('serviceAuthentication.username');
  const docsPassword = config.get<string>('serviceAuthentication.password');

  app.use(
    [docsBaseUrl],
    basicAuth({
      challenge: true,
      users: { [docsUsername]: docsUsername, [docsPassword]: docsPassword },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle(`${serviceName} API specification`)
    .setDescription(
      `${
        serviceDesc || 'API specification for blog project service'
      } | [swagger.json](swagger.json)`,
    )
    .setVersion(apiVersion)
    .addServer(
      `${config.get<string>('server.swaggerSchema')}://${config.get<string>(
        'server.hostname',
      )}:${config.get<string>('server.port')}${config.get<string>(
        'service.baseUrl',
      )}`,
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: true,
  });
  writeSwaggerJSONFile(process.cwd(), document);
  const server = app.getHttpAdapter();
  server.get(`${docsBaseUrl}/swagger.json`, (req, res) => {
    res.json(document);
  });

  SwaggerModule.setup(docsBaseUrl, app, document, {
    swaggerOptions: {
      displayOperationId: true,
      persistAuthorization: true,
    },
    customSiteTitle: serviceName,
  });
}

function writeSwaggerJSONFile(path: string, document: OpenAPIObject) {
  const swaggerFile = `${path}/swagger.json`;
  fs.writeFileSync(swaggerFile, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });
}
