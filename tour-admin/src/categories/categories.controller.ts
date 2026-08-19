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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { EditCategoryDto } from './dtos/edit-category.dto';
import { AdminGuard } from '../auth/guards/admin.guards';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  // GET localhost:3000/categories
  @Get()
  async getCategories(
    @Query()
    query: {
      _start?: string;
      _end?: string;
      _sort?: string;
      _order?: 'asc' | 'desc';
      search?: string;
    },
    @Res() res: Response,
  ) {
    const start = query._start ? parseInt(query._start, 10) : undefined;
    const end = query._end ? parseInt(query._end, 10) : undefined;

    const { data, total } = await this.categoriesService.getAll({
      _start: start,
      _end: end,
      _sort: query._sort,
      _order: query._order,
      search: query.search,
    });

    res.setHeader('X-Total-Count', total.toString());
    return res.status(HttpStatus.OK).json(data);
  }

  // GET localhost:3000/categories/:id
  @Get('/:id')
  async getCategoryById(@Param('id') id: string) {
    const numericId = Number(id);
    const category = await this.categoriesService.getById(numericId);
    if (!category) {
      throw new NotFoundException(`Nie znaleziono kategorii o ID: ${id}`);
    }
    return category;
  }

  // POST localhost:3000/categories
  @UseGuards(AdminGuard)
  @Post()
  async addCategory(@Body() body: CreateCategoryDto) {
    return this.categoriesService.add(body);
  }

  // PATCH localhost:3000/categories/:id
  @UseGuards(AdminGuard)
  @Patch('/:id')
  async editCategory(@Param('id') id: string, @Body() body: EditCategoryDto) {
    return this.categoriesService.edit(+id, body);
  }

  // DELETE localhost:3000/categories/:id
  @UseGuards(AdminGuard)
  @Delete('/:id')
  @HttpCode(204)
  async removeCategory(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
