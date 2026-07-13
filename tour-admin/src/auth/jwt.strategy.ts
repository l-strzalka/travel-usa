import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

interface JWTPayload {
  id: string;
  email: string;
  status: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Mówimy Passportowi, że token będzie przesyłany w nagłówku jako "Bearer TOKEN"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'NASZ_BARDZO_TAJNY_KLUCZ_ADMINA_123',
    });
  }

  // Ta metoda odpali się automatycznie, gdy token będzie poprawny.
  // To co tutaj zwróci, NestJS automatycznie przypisze do obiektu żądania jako `req.user`!
  validate(payload: JWTPayload) {
    return {
      userId: payload.id,
      email: payload.email,
      status: payload.status,
    };
  }
}
