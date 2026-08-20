// tour-admin\src\products\dtos\create-products.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO dla pojedynczego punktu na trasie
export class RoutePointDto {
  // Pozwalamy na pole 'id' (opcjonalne przy tworzeniu, obecne przy edycji)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  categoryId?: number;

  // Pozwalamy na pole 'productId' (jeśli baza/ORM je zwraca i przesyła)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productId?: number;

  @IsNumber(
    {},
    { message: 'Szerokość geograficzna (latitude) musi być liczbą' },
  )
  @Type(() => Number)
  latitude!: number;

  @IsNumber({}, { message: 'Długość geograficzna (longitude) musi być liczbą' })
  @Type(() => Number)
  longitude!: number;

  @IsInt({
    message: 'Kolejność przystanku (stopOrder) musi być liczbą całkowitą',
  })
  @Type(() => Number)
  stopOrder!: number;

  @IsOptional()
  @IsString({ message: 'Nazwa przystanku musi być tekstem' })
  title?: string;
}

export class CreateProductsDto {
  @IsString({ message: 'Nazwa produktu musi być tekstem!' })
  @IsNotEmpty({ message: 'Nazwa produktu nie może być pusta' })
  name!: string;

  @IsNumber({}, { message: 'Cena musi być liczbą' })
  @Min(0, {
    message: 'Cena nie może być ujemna (musi wynosić co najmniej 0 PLN)',
  })
  @Type(() => Number)
  price!: number;

  @IsString({ message: 'Opis musi być tekstem' })
  @IsNotEmpty({ message: 'Opis nie może być pusty' })
  description!: string;

  @IsInt({ message: 'Kategoria jest wymagana i musi być liczbą całkowitą' })
  @Type(() => Number)
  categoryId!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Szerokość geograficzna musi być liczbą' })
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Długość geograficzna musi być liczbą' })
  @Type(() => Number)
  longitude?: number;

  // Pole relacyjne obsługujące punkty trasy
  @IsOptional()
  @IsArray({ message: 'Punkty trasy muszą być tablicą' })
  @ValidateNested({ each: true })
  @Type(() => RoutePointDto)
  routePoints?: RoutePointDto[];
}
