import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetNewsletterQueryDto {
  @IsOptional()
  @IsString()
  _start?: string;

  @IsOptional()
  @IsString()
  _end?: string;

  @IsOptional()
  @IsString()
  _sort?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  _order?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search?: string;
}
