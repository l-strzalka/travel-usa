// import 'tsconfig-paths/register'; ten import nie jest potrzebny do produkcji na vercel
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
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
  const candidateStaticPaths = process.env.VERCEL
    ? [join(tmpdir(), 'uploads'), join(process.cwd(), 'src', 'assets')]
    : [join(process.cwd(), 'uploads'), join(process.cwd(), 'src', 'assets')];

  let staticAssetsPath = candidateStaticPaths[0];

  for (const candidate of candidateStaticPaths) {
    try {
      if (!existsSync(candidate)) {
        mkdirSync(candidate, { recursive: true });
      }
      staticAssetsPath = candidate;
      break;
    } catch {
      continue;
    }
  }

  app.useStaticAssets(staticAssetsPath, {
    prefix: '/uploads',
  });

  if (process.env.VERCEL) {
    await app.init();
    return app.getHttpAdapter().getInstance();
  }

  await app.listen(process.env.PORT ?? 3000);
}
export default bootstrap();
