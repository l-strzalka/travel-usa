import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Nazwa kategorii musi być tekstem' })
  @IsNotEmpty({ message: 'Nazwa kategorii nie może być pusta' })
  name!: string;

  @IsString({ message: 'Opis musi być tekstem' })
  @IsOptional()
  description?: string;
}