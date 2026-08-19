import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { EditCategoryDto } from './dtos/edit-category.dto';

export interface GetCategoriesQuery {
  _start?: number;
  _end?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
  search?: string;
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAll(
    query: GetCategoriesQuery,
  ): Promise<{ data: Category[]; total: number }> {
    const { _start, _end, _sort, _order, search } = query;

    const skip = _start !== undefined ? Number(_start) : undefined;
    const take =
      _end !== undefined && _start !== undefined
        ? Number(_end) - Number(_start)
        : undefined;

    const sortOrder: 'asc' | 'desc' =
      _order?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const orderBy = _sort ? { [_sort]: sortOrder } : { id: sortOrder };

    const where: Prisma.CategoryWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.category.count({ where }),
    ]);

    return { data, total };
  }

  async getById(id: number): Promise<Category> {
    if (isNaN(id)) {
      throw new BadRequestException('Niepoprawny ID kategorii');
    }

    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true, // <-- ZMIENIONO z 'product' na 'products'
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Kategoria o ID ${id} nie została znaleziona`,
      );
    }

    return category;
  }

  async add(data: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async edit(id: number, data: EditCategoryDto): Promise<Category> {
    await this.getById(id);

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<void> {
    await this.getById(id);

    await this.prisma.category.delete({
      where: { id },
    });
  }
}