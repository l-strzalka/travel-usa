import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateProductsDto {
  @IsString({ message: 'Nazwa produktu musi być tekstem!' })
  @IsNotEmpty({ message: 'Nazwa produktu nie może być pusta' })
  name!: string;

  @IsNumber({}, { message: 'Cena musi być liczbą' })
  price!: number;

  @IsString({ message: 'Opis musi być tekstem' })
  @IsNotEmpty({ message: 'Opis nie może być pusty' })
  description!: string;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  location?: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}
