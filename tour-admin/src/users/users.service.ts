import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User | null> {
    return this.prisma.user.create({
      data,
    });
  }

  async remove(email: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { email },
      });
    } catch (error) {
      throw new NotFoundException(
        `Użytkownik o adresie email ${email} nie istnieje i nie może zostać usunięty.`,
      );
    }
  }
}
