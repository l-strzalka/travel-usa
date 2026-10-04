import { IsEmail, IsBoolean, Equals } from 'class-validator';

export class SubscribeNewsletterDto {
  @IsEmail({}, { message: 'Niepoprawny format adresu e-mail' })
  email!: string;

  @IsBoolean({ message: 'Zgoda marketingowa musi być wartością logiczną' })
  @Equals(true, {
    message: 'Zgoda na przetwarzanie danych osobowych jest wymagana',
  })
  marketingConsent!: boolean;
}
