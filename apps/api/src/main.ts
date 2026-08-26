import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const configService = app.get(ConfigService);
  const frontendUrl = configService.getOrThrow<string>('FRONTEND_URL');
  app.enableCors({
    origin: [frontendUrl],
    credentials: true,
  });
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const port = configService.getOrThrow<number>('PORT');
  const config = new DocumentBuilder()
    .setTitle('ComponentIQ API')
    .setDescription(
      'API documentation for organizations, projects, catalog components, guardrails, AI recommendations, and audits.'
    )
    .setVersion('1.0')
    .addServer('https://componentiq-api.onrender.com', 'Render production')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Paste a Clerk session JWT. Swagger will add the Bearer prefix automatically.',
      },
      'bearer'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.getHttpAdapter().get('/', (_request, response) => {
    response.redirect('/api/docs');
  });
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'ComponentIQ API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  await app.listen(port);
}

bootstrap();
