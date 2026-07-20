import { NestFactory } from '@nestjs/core';
import { AppModule } from './../src/app.module'; // Dostosuj ścieżkę do AppModule po zbudowaniu
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function createServer() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

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

  // UWAGA: Na Vercelu katalog uploads nie zadziała trwale,
  // ale jeśli to konieczne dla kompatybilności, zostawiamy warunkowo:
  if (!process.env.VERCEL) {
    const { existsSync, mkdirSync } = require('fs');
    const { join } = require('path');
    const staticAssetsPath = join(process.cwd(), 'uploads');
    if (!existsSync(staticAssetsPath)) {
      mkdirSync(staticAssetsPath, { recursive: true });
    }
    app.useStaticAssets(staticAssetsPath, { prefix: '/uploads' });
  }

  await app.init();
  return server;
}

const cachedServer = createServer();

export default async function handler(req: any, res: any) {
  const app = await cachedServer;
  return app(req, res);
}
