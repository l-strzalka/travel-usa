import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Podany adres email jest niepoprawny!' })
  @IsNotEmpty({ message: 'Email jest wymagany' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Hasło jest wymagane' })
  password!: string;
}
