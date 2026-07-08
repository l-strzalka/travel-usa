import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  // Nadpisuje metodę obsługi żądania
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Jeśli Passport zgłosi błąd lub nie znajdzie użytkownika (zły/brak tokenu)
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Musisz się zalogować, aby mieć dostęp do tej akcji!',
        )
      );
    }

    // Sprawdza czy zalogowany użytkownik ma status admin
    if (user.status !== 'ADMIN') {
      throw new UnauthorizedException(
        'Brak uprawnień! Tylko administrator może zarządzać produktami.',
      );
    }

    // Jeśli wszystko oKay, wpuszczamy użytkownika dalej
    return user;
  }
}
