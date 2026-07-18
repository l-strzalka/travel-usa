import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
// import { ConfigService } from '@nestjs/config';
import { AdminGuard } from './guards/admin.guards';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'NASZ_BARDZO_TAJNY_KLUCZ_ADMINA_123',
      signOptions: { expiresIn: '1d' },
    }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'), // Czyta JWT_SECRET z pliku .env
    //     signOptions: {
    //       expiresIn: configService.get('JWT_EXPIRES_IN') ?? '1d', // Czyta JWT_EXPIRES_IN z pliku .env
    //     },
    //   }),
    // }),
  ],
  providers: [AuthService, JwtStrategy, AdminGuard],
  controllers: [AuthController],
  exports: [AdminGuard],
})
export class AuthModule {}
