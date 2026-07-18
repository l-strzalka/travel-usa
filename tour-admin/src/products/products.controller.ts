//tour-admin\src\products\products.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Post,
  HttpCode,
  Patch,
  UseGuards,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProductService } from './products.service';
import { CreateProductsDto } from './dtos/create-products.dto';
import { EditProductDto } from './dtos/edit-product.dto';
// import { AdminGuard } from '../auth/guards/admin.guards';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductService) {}

  // GET localhost:3000/products
  @Get()
  async getProducts(
    @Query()
    query: {
      _start?: string;
      _end?: string;
      _sort?: string;
      _order?: 'asc' | 'desc';
    },
    @Res() res: Response,
  ) {
    const start = query._start ? parseInt(query._start, 10) : undefined;
    const end = query._end ? parseInt(query._end, 10) : undefined;

    const { data, total } = await this.productsService.getAll({
      _start: start,
      _end: end,
      _sort: query._sort,
      _order: query._order,
    });

    res.setHeader('X-Total-Count', total.toString());

    return res.status(HttpStatus.OK).json(data);
  }

  // GET localhost:3000/products/search/name
  // UWAGA: Ta ścieżka musi być wyżej niż /:idOrSlug!
  @Get('search/name')
  async getProductByName(@Query('name') name: string) {
    return this.productsService.getByName(name);
  }

  // GET localhost:3000/products/1 LUB localhost:3000/products/kalifornia-trip
  @Get('/:idOrSlug')
  async getProductBySlug(@Param('idOrSlug') idOrSlug: string) {
    const id = Number(idOrSlug);

    // 1. Jeśli parametr jest liczbą, wyszukujemy po ID (np. dla panelu admina)
    if (!isNaN(id)) {
      const product = await this.productsService.getById(id);
      if (!product) {
        throw new NotFoundException(`Nie znaleziono wycieczki o ID: ${id}`);
      }
      return product;
    }

    // 2. Jeśli to tekst, wyszukujemy po unikalnym slugu (dla strony klienckiej)
    const product = await this.productsService.getBySlug(idOrSlug);
    if (!product) {
      throw new NotFoundException(
        `Nie znaleziono wycieczki o URL: ${idOrSlug}`,
      );
    }
    return product;
  }

  // POST localhost:3000/products
  // @UseGuards(AdminGuard)
  @Post()
  async addProduct(@Body() body: CreateProductsDto) {
    return this.productsService.add(body);
  }

  // DELETE localhost:3000/products/1
  // @UseGuards(AdminGuard)
  @Delete('/:id')
  @HttpCode(204)
  async removeProduct(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  // PATCH localhost:3000/products/1
  // @UseGuards(AdminGuard)
  @Patch(':id')
  async editProduct(@Body() body: EditProductDto, @Param('id') id: string) {
    return this.productsService.edit(+id, body);
  }
}
