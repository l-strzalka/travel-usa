//tour-admin\src\products\dtos\edit-product.dto.ts
import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoutePointDto } from './create-products.dto';

export class EditProductDto {
  @IsString({ message: 'Nazwa produktu musi być tekstem!' })
  @IsOptional()
  name?: string;

  @IsNumber({}, { message: 'Cena musi być liczbą' })
  @IsOptional()
  @Min(0, {
    message: 'Cena nie może być ujemna (musi wynosić co najmniej 0 PLN)',
  })
  @Type(() => Number)
  price?: number;

  @IsString({ message: 'Opis musi być tekstem' })
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  // Nowe pole relacyjne obsługujące punkty trasy podczas edycji
  @IsOptional()
  @IsArray({ message: 'Punkty trasy muszą być tablicą' })
  @ValidateNested({ each: true })
  @Type(() => RoutePointDto)
  routePoints?: RoutePointDto[];
}
