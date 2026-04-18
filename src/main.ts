import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from 'prisma/prisma.service';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const prismaService = app.get(PrismaService);
  app.useGlobalInterceptors(new AuditInterceptor(prismaService));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('RevoBank API')
    .setDescription('Dokumentasi API Perbankan - User, Account, & Transactions')
    .setVersion('1.0')
    .addServer(`https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost:3000'}`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  
  console.log(`Application is running on port: ${port}`);
  console.log(`Swagger docs: /api-docs`);
}
bootstrap();
