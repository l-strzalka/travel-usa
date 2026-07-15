import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { EditProductDto } from './dtos/edit-product.dto';
import { CreateProductsDto } from './dtos/create-products.dto';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private async generateUniqueSlug(
    name: string,
    currentId?: number,
  ): Promise<string> {
    const baseSlug = slugify(name, { lower: true, strict: true, locale: 'pl' });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      // Szukamy w bazie produktu o takim samym slugu
      const existing = await this.prisma.product.findUnique({
        where: { slug },
      });

      // Jeśli slug jest wolny LUB należy do aktualnie edytowanego produktu
      if (!existing || existing.id === currentId) {
        break;
      }

      // Jeśli istnieje kolizja, dodajemy licznik, np. "sloneczna-kalifornia-1"
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async getBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
    });
  }

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
    if (data.price < 0) {
      throw new BadRequestException(
        'Błąd krytyczny: Cena nie może być mniejsza niz 0',
      );
    }
    // wygeneruj unikalny slug przed zapisem (Prisma wymaga pola slug)
    const slug = await this.generateUniqueSlug(data.name);
    return this.prisma.product.create({
      data: { ...data, slug },
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

    // jeśli zmieniona nazwa, zaktualizuj slug unikając kolizji
    const updateData: EditProductDto & { slug?: string } = { ...data };
    if (data.name) {
      updateData.slug = await this.generateUniqueSlug(data.name, id);
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }
}
