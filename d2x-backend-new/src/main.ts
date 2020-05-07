import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressip  from 'express-ip';
import * as requestIp   from 'request-ip';
const PORT = 8000
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.use(requestIp.mw())
  app.use(cors());
  app.use(expressip().getIpInfoMiddleware);
  app.use(bodyParser.json({ limit: '50MB' }));
  const options = new DocumentBuilder()
    .setTitle('ALL API')
    .setVersion('2.0')
    .addTag('tags')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  await app.listen(PORT);
};
bootstrap();
