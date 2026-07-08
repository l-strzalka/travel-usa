import { IsNumber, IsString, IsOptional } from 'class-validator';

export class EditProductDto {
  @IsString({ message: 'Nazwa produktu musi być tekstem!' })
  @IsOptional()
  name?: string;

  @IsNumber({}, { message: 'Cena musi być liczbą' })
  @IsOptional()
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
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}
