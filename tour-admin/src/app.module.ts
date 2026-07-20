//tour-admin\src\app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
// import { UploadModule } from './upload/upload.module';

// import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    PrismaModule,
    AuthModule,
    // UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
