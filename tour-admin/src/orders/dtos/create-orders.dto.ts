import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsArray,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsInt({ message: 'ProductId musi być liczbą' })
  @IsNotEmpty({ message: 'Product ID jest wymagany' })
  productId!: number;

  @IsInt({ message: 'Ilość musi być liczbą' })
  @Min(1, { message: 'Minimalna ilość to 1' })
  quantity!: number;

  @IsInt({ message: 'Cena musi być liczbą' })
  price!: number;
}

export class CreateOrdersDto {
  @IsString({ message: 'Nazwa zamawiającego musi być tekstem' })
  @IsNotEmpty({ message: 'Nazwa zamawiającego nie może być pusta' })
  customerName!: string;

  @IsString({ message: 'Email musi być tekstem' })
  @IsNotEmpty({ message: 'Email jest wymagany' })
  customerEmail!: string;

  @IsNotEmpty({ message: 'Telefon jest wymagany' })
  @IsInt({ message: 'Numer telefonu jest wymagany' })
  customerPhone!: number;

  @IsInt({ message: 'UserId musi być liczbą' })
  @IsOptional()
  userId?: number;

  @IsArray({ message: 'Elementy zamówienia muszą być tablicą' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsNotEmpty({ message: 'Zamówienie musi zawierać przynajmniej 1 produkt' })
  items!: CreateOrderItemDto[];
}
