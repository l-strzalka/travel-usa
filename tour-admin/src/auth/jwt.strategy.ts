import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Mówimy Passportowi, że token będzie przesyłany w nagłówku jako "Bearer TOKEN"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Używa dokładnie tego samego klucza co w AuthModule
      secretOrKey: 'NASZ_BARDZO_TAJNY_KLUCZ_ADMINA_123',
    });
  }

  // Ta metoda odpali się automatycznie, gdy token będzie poprawny.
  // To co tutaj zwróci, NestJS automatycznie przypisze do obiektu żądania jako `req.user`!
  validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      status: payload.status,
    };
  }
}
