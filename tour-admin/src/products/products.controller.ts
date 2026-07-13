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
} from '@nestjs/common';
import type { Response } from 'express';
import { ProductService } from './products.service';
import { CreateProductsDto } from './dtos/create-products.dto';
import { EditProductDto } from './dtos/edit-product.dto';
import { AdminGuard } from 'src/auth/guards/admin.guards';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductService) {}

  //GET localhost:3000/products
  @UseGuards(AdminGuard)
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

  //GET localhost:3000/products/1
  @UseGuards(AdminGuard)
  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    return this.productsService.getById(+id);
  }

  @Get('search/name')
  async getProductByName(@Query('name') name: string) {
    return this.productsService.getByName(name);
  }

  //POST localhost:3000/products
  @UseGuards(AdminGuard)
  @Post()
  async addProduct(@Body() body: CreateProductsDto) {
    return this.productsService.add(body);
  }

  //DELETE localhost:3000/products/1
  @UseGuards(AdminGuard)
  @Delete('/:id')
  @HttpCode(204)
  async removeProduct(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  //PATCH localhost:3000/products/1
  @UseGuards(AdminGuard)
  @Patch(':id')
  async editProduct(@Body() body: EditProductDto, @Param('id') id: string) {
    return this.productsService.edit(+id, body);
  }
}
