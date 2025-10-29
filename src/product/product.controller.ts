import { Controller, Get, Post, Patch, Delete, Body, Param} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductDocument } from './schemas/product.schema';

@Controller('product') 
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() body: Partial<Product>) {
    return this.productService.create(body);
  }

  @Get('user/:userId')
  async getProductsByUser(@Param('userId') userId: string): Promise<ProductDocument[]> {
  return this.productService.findByUser(userId);
}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get('category/:categoryId')
  async getProductsByCategory(@Param('categoryId') categoryId: string): Promise<ProductDocument[]> {
    return this.productService.findByCategory(categoryId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Product>) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
