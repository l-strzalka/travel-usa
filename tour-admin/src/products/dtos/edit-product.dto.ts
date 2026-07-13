import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class EditProductDto {
  @IsString({ message: 'Nazwa produktu musi być tekstem!' })
  @IsOptional()
  name?: string;

  @IsNumber({}, { message: 'Cena musi być liczbą' })
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsString({ message: 'Opis musi być tekstem' })
  @IsOptional()
  description?: string;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;
}
