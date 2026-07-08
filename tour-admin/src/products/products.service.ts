import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { EditProductDto } from './dtos/edit-product.dto';
import { CreateProductsDto } from './dtos/create-products.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    console.log(products);

    if (!products) {
      throw new NotFoundException('Obecnie żaden produkt nie istnieje');
    }
    return products;
  }

  async getByName(name: string): Promise<Product> {
    try {
      const product = await this.prisma.product.findFirst({
        where: { name },
      });
      if (!product) {
        throw new NotFoundException('Produkt o takiej nazwie nie istnieje');
      }
      return product;
    } catch (error) {
      console.error('BŁĄD PRISMY W getByName:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Product> {
    if (isNaN(id)) {
      throw new BadRequestException('Niepoprawny ID produktu');
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Produkt o ID ${id} nie zotsał znaleziony`);
    }
    return product;
  }

  async add(data: CreateProductsDto): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async remove(id: number): Promise<void> {
    await this.getById(id);

    await this.prisma.product.delete({
      where: { id },
    });
  }

  async edit(id: number, data: EditProductDto): Promise<Product> {
    await this.getById(id);

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
}
