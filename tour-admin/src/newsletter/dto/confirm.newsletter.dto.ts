import { IsUUID } from 'class-validator';

export class ConfirmedNewsletterDto {
  @IsUUID('4', { message: 'Niepoprawny format tokena weryfikacyjnego' })
  token: string;
}
