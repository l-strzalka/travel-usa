// import 'tsconfig-paths/register'; ten import nie jest potrzebny do produkcji na vercel
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'https://travel-usa-p2t7.vercel.app',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['X-Total-Count'],
  });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //   }),
  // );
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads', // Pliki będą dostępne pod adresem http://localhost:3000/uploads/...
  });

  if (process.env.VERCEL) {
    await app.init();
    return app.getHttpAdapter().getInstance();
  }

  await app.listen(process.env.PORT ?? 3000);
}
export default bootstrap();
