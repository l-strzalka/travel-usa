import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  Min,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class EditOrderItemDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsInt({ message: 'ProductId musi być liczbą' })
  productId!: number;

  @IsInt({ message: 'Ilość musi być liczbą' })
  @Min(1, { message: 'Minimalna ilość to 1' })
  quantity!: number;

  @IsInt({ message: 'Cena musi być liczbą' })
  price!: number;
}

export class EditOrdersDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsInt()
  customerPhone?: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  orders?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditOrderItemDto)
  items?: EditOrderItemDto[];
}
