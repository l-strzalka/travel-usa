import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductsDto {
  @IsString({ message: 'Nazwa produktu musi być tekstem!' })
  @IsNotEmpty({ message: 'Nazwa produktu nie może być pusta' })
  name!: string;

  @IsNumber({}, { message: 'Cena musi być liczbą' })
  @Type(() => Number)
  price!: number;

  @IsString({ message: 'Opis musi być tekstem' })
  @IsNotEmpty({ message: 'Opis nie może być pusty' })
  description!: string;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Szerokość geograficzna musi być liczbą' })
  @Type(() => Number)
  latitude!: number;

  @IsOptional()
  @IsNumber({}, { message: 'Długość geograficzna musi być liczbą' })
  @Type(() => Number)
  longitude!: number;
}
