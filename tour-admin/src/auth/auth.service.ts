import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Rejestracja nowego użytkownika
  async register(body: RegisterDto) {
    // Sprawdza czy użytkownik o takim emailu już istnieje
    const userExists = await this.usersService.findByEmail(body.email);

    if (userExists) {
      throw new BadRequestException(
        'Użytkownik o takim adresie email już istnieje!',
      );
    }

    // bcrypt szyfruje hasło robi hash
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // zapisuje użytkownika w bazie MySQL
    const newUser = await this.usersService.create({
      email: body.email,
      password: hashedPassword,
      name: body.name || null,
      status: body.status || 'USER', // Domyślnie USER
    });

    // Zwraca stworzonego użytkownika, ale BEZ hasła dla bezpieczeństwa

    if (!newUser) {
      throw new BadRequestException('Nie udało się utworzyć użytkownika');
    }
    const { password, ...result } = newUser;
    return result;
  }

  async login(body: LoginDto) {
    // szuka użytkowniaka w bazie danych
    const user = await this.usersService.findByEmail(body.email);

    //sprawdza, czy użytkownik istnieje i czy nie otrzymaliśmy błędu
    if (!user) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    //sprawdza, czy hasło się zgadza

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Niepoprawny email lub hasło');
    }

    const validUser = user as { id: number; email: string; status: string };
    const payload = {
      id: validUser.id,
      email: validUser.email,
      status: validUser.status,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
      },
    };
  }
}
