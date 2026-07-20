// import 'tsconfig-paths/register'; ten import nie jest potrzebny do produkcji na vercel
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { existsSync, mkdirSync } from 'fs';
// import { join } from 'path';

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
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'],
  });

  // const staticAssetsPath = join(process.cwd(), 'uploads');

  // if (!existsSync(staticAssetsPath)) {
  //   mkdirSync(staticAssetsPath, { recursive: true });
  // }

  // app.useStaticAssets(staticAssetsPath, {
  //   prefix: '/uploads',
  // });

  // if (process.env.VERCEL) {
  //   await app.init();
  //   return app.getHttpAdapter().getInstance();
  // }

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port).catch((error) => {
    if (error && (error as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      return app.listen(port + 1);
    }
    throw error;
  });
}
export default bootstrap();
