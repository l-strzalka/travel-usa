import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';

export class EditCategoryDto extends PartialType(CreateAdminDto) {}
