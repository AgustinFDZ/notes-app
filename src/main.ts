import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/app/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Notes API')
    .setDescription('Backend API for Notes App')
    .setVersion('1.0')
    .addTag('notes')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(envs.port ?? 3000);

  logger.log(`Server is running on port ${envs.port ?? 3000}`);
}
bootstrap();
