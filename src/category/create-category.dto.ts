// create-category.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  image: string; // Ruta o URL

  @IsOptional()
  @IsString()
  parentId?: string; // Id de la categoría padre
}
