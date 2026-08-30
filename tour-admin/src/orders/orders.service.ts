import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdersDto } from './dtos/create-orders.dto';
import { OrderStatus } from '@prisma/client';
import { EditOrdersDto } from './dtos/edit-orders.dto';

@Injectable()
export class OrdersService {
  edit(id: number, dto: EditOrdersDto) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Zamówienie o ID ${id} nie istnieje.`);
    }

    return order;
  }

  async create(dto: CreateOrdersDto) {
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException(
        'Niektóre z wybranych wycieczek nie istnieją.',
      );
    }

    let totalAmount = 0;
    const orderItemsData = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const itemPrice = Number(product.price);
      totalAmount += itemPrice * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice,
      };
    });

    return this.prisma.order.create({
      data: {
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        userId: dto.userId || null,
        totalAmount,
        status: OrderStatus.PENDING,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async updateStatus(id: number, status: OrderStatus) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async update(id: number, dto: EditOrdersDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        userId: dto.userId || null,
        status: dto.status,
      },
      include: {
        items: true,
      },
    });
  }
}
