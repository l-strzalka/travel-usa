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

  async getAll(query: {
    _start?: number;
    _end?: number;
    _sort?: string;
    _order?: 'asc' | 'desc';
  }): Promise<{ data: Product[]; total: number }> {
    const { _start, _end, _sort, _order } = query;

    const skip = _start ? Number(_start) : undefined;
    const take = _end && _start ? Number(_end) - Number(_start) : undefined;
    const sortOrder: 'asc' | 'desc' =
      _order?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const orderBy = _sort ? { [_sort]: sortOrder } : { id: sortOrder };

    // Wykonujemy zapytania równolegle, oszczędzając zasoby bazy danych
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        orderBy,
      }),
      this.prisma.product.count(),
    ]);

    return { data, total };
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
