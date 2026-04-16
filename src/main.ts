import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from 'prisma/prisma.service';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  const prismaService = app.get(PrismaService);
  app.useGlobalInterceptors(new AuditInterceptor(prismaService));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('RevoBank API')
    .setDescription('Dokumentasi API Perbankan - User, Account, & Transactions')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); //http://localhost:3000/api-docs

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}/api-docs`);

}
bootstrap();
