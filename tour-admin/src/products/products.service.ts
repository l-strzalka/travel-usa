//\tour-admin\src\products\products.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
import { EditProductDto } from './dtos/edit-product.dto';
import { CreateProductsDto } from './dtos/create-products.dto';
import slugify from 'slugify';

export interface GetProductsQuery {
  _start?: number;
  _end?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  categoryId?: number;
}

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
      // Dołączamy punkty trasy posortowane po kolejności
      include: {
        routePoints: {
          orderBy: { stopOrder: 'asc' },
        },
      },
    });
  }

  private async getCategoryIdsByName(search: string): Promise<number[]> {
    const normalizedSearch = search.trim();
    if (!normalizedSearch) return [];

    const categories = await this.prisma.category.findMany({
      where: {
        name: { contains: normalizedSearch },
      },
      select: {
        id: true,
      },
    });

    return categories.map((category) => category.id);
  }

  async getSearchSuggestions(query: string) {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return [];

    const matchingCategoryIds =
      await this.getCategoryIdsByName(normalizedQuery);

    const [products, categories] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: normalizedQuery } },
            { location: { contains: normalizedQuery } },
            { description: { contains: normalizedQuery } },
            {
              categoryId: {
                in: matchingCategoryIds.length ? matchingCategoryIds : [-1],
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          location: true,
          category: {
            select: {
              name: true,
            },
          },
        },
        take: 10,
      }),
      this.prisma.category.findMany({
        where: {
          name: { contains: normalizedQuery },
        },
        select: {
          id: true,
          name: true,
        },
        take: 10,
      }),
    ]);

    const productSuggestions = products.map((product) => ({
      id: product.id,
      label: product.name,
      category: product.category?.name || product.location || 'USA',
      _score: product.name.toLowerCase().includes(normalizedQuery.toLowerCase())
        ? 2
        : 1,
    }));

    const categorySuggestions = categories.map((category) => ({
      id: category.id,
      label: category.name,
      category: 'Kategoria',
      _score: category.name
        .toLowerCase()
        .includes(normalizedQuery.toLowerCase())
        ? 3
        : 2,
    }));

    const merged = [...productSuggestions, ...categorySuggestions];
    const uniqueByLabel = new Map<string, (typeof merged)[number]>();

    merged.forEach((item) => {
      const key = item.label.toLowerCase();
      if (!uniqueByLabel.has(key)) {
        uniqueByLabel.set(key, item);
      }
    });

    return Array.from(uniqueByLabel.values())
      .sort((a, b) => (b._score ?? 0) - (a._score ?? 0))
      .map(({ _score, ...item }) => item)
      .slice(0, 10);
  }

  async getAll(
    query: GetProductsQuery,
  ): Promise<{ data: Product[]; total: number }> {
    const {
      _start,
      _end,
      _sort,
      _order,
      search,
      minPrice,
      maxPrice,
      location,
      categoryId,
    } = query;

    const skip = _start ? Number(_start) : undefined;
    const take = _end && _start ? Number(_end) - Number(_start) : undefined;
    const sortOrder: 'asc' | 'desc' =
      _order?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const orderBy = _sort ? { [_sort]: sortOrder } : { id: sortOrder };

    const where: Prisma.ProductWhereInput = {};

    if (categoryId !== undefined) {
      where.categoryId = Number(query.categoryId);
    }

    if (search) {
      const matchingCategoryIds = await this.getCategoryIdsByName(search);

      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
        {
          categoryId: {
            in: matchingCategoryIds.length ? matchingCategoryIds : [-1],
          },
        },
      ];
    }

    if (location) {
      where.location = { contains: location };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }

    // Wykonujemy zapytania równolegle, oszczędzając zasoby bazy danych
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        // Pobieramy punkty również dla listy (np. do podglądu)
        include: {
          routePoints: {
            orderBy: { stopOrder: 'asc' },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  async getByName(name: string): Promise<Product> {
    try {
      const product = await this.prisma.product.findFirst({
        where: { name },
        include: {
          routePoints: {
            orderBy: { stopOrder: 'asc' },
          },
        },
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
      include: {
        routePoints: {
          orderBy: { stopOrder: 'asc' },
        },
      },
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
    const { routePoints, ...productData } = data;
    const slug = await this.generateUniqueSlug(productData.name);
    // Separujemy punkty trasy od reszty danych produktu
    return this.prisma.product.create({
      data: {
        ...productData,
        slug,
        // Jeśli przesłano punkty, utwórz je w relacji
        routePoints: routePoints?.length ? { create: routePoints } : undefined,
      },
      include: { routePoints: true },
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

    const { routePoints, name, ...restData } = data;
    // Typujemy jako 'any' z uwagi na dynamiczną budowę payloadu dla Prismy
    const updateData: any = { ...restData };

    if (name) {
      updateData.name = name;
      updateData.slug = await this.generateUniqueSlug(name, id);
    }

    // Jeśli w DTO przesłano nową tablicę punktów trasy
    if (routePoints) {
      // Oczyszczamy obiekty punktów trasy z niedozwolonych pól 'id' i 'productId' dla klauzuli Prisma create
      const cleanRoutePoints = routePoints.map(
        ({ id, productId, ...point }) => point,
      );

      updateData.routePoints = {
        deleteMany: {}, // Najpierw czyścimy stare punkty dla tego produktu
        create: cleanRoutePoints, // Następnie zapisujemy nową konfigurację
      };
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        routePoints: {
          orderBy: { stopOrder: 'asc' },
        },
      },
    });
  }
}
