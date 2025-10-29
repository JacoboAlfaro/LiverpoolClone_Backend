import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './update-category.dto';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryWithChildren } from './category.schema';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('tree')
  findHierarchy() {
    return this.categoriesService.findHierarchy();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/children')
  async findOneWithChildren(@Param('id') id: string): Promise<CategoryWithChildren> {
    const category = await this.categoriesService.findWithChildren(id);
    console.log({ category });
    return category;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
