import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { ConfirmedNewsletterDto } from './dto/confirm.newsletter.dto';
import { SubscribeStatus, Newsletter } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(dto: SubscribeNewsletterDto, clientIp?: string) {
    const normalizedEmail = dto.email.toLocaleLowerCase().trim();

    const existingSubscription: Newsletter | null =
      await this.prisma.newsletter.findUnique({
        where: { email: normalizedEmail },
      });

    if (existingSubscription !== null) {
      if (existingSubscription.status === SubscribeStatus.CONFIRMED) {
        throw new ConflictException(
          'Ten adres email jest już zapisany do newslettera',
        );
      }

      await this.prisma.newsletter.update({
        where: {
          email: normalizedEmail,
        },
        data: {
          confirmationToken: randomUUID(),
          consentIP: clientIp,
          marketingConsent: dto.marketingConsent,
        },
      });

      return {
        message: 'wyslano nowy link aktywacyjny na podany adres e-mail.',
      };
    }

    await this.prisma.newsletter.create({
      data: {
        email: normalizedEmail,
        marketingConsent: dto.marketingConsent,
        consentIP: clientIp,
        confirmationToken: randomUUID(),
        status: SubscribeStatus.PENDING,
      },
    });

    return {
      message:
        'Rejestracja pomyślna. Sprawdź skrzynkę e-mail, aby potwierdzić subskrypcję',
    };
  }

  async confirm(dto: ConfirmedNewsletterDto): Promise<{ message: string }> {
    const subscription = await this.prisma.newsletter.findUnique({
      where: { confirmationToken: dto.token },
    });

    if (!subscription) {
      throw new NotFoundException(
        'Nieprawidłowy, lub wygasły token aktywacyjny.',
      );
    }

    if (subscription.status === SubscribeStatus.CONFIRMED) {
      return { message: 'Subskrypcja została już wcześniej potwierdzona.' };
    }

    await this.prisma.newsletter.update({
      where: {
        confirmationToken: dto.token,
      },
      data: {
        status: SubscribeStatus.CONFIRMED,
        confirmedAt: new Date(),
      },
    });

    return {
      message:
        'Adres email został pomyślnie zweryfikowany. Witamy w newsletterze!',
    };
  }
}
