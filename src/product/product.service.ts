import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(data: Partial<Product>): Promise<ProductDocument> {
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().exec();
  }

  async findById(id: string): Promise<ProductDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('ID de producto invalido');
    }
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async findByCategory(categoryId: string): Promise<ProductDocument[]> {
    if (!isValidObjectId(categoryId)) {
      throw new NotFoundException('ID de categoría inválido');
    }

    // Busca los productos cuyo array de categorías contenga el categoryId
    const products = await this.productModel
      .find({ categorias: { $in: [categoryId] } })
      .exec();

    if (products.length === 0) {
      throw new NotFoundException('No se encontraron productos para esta categoría');
    }

    return products;
  }

  async update(id: string, data: Partial<Product>): Promise<ProductDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('ID de producto invalido');
    }
    const product = await this.productModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('ID de producto invalido');
    }
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Producto no encontrado');
  }

  async findByUser(userId: string): Promise<ProductDocument[]> {
  if (!isValidObjectId(userId)) {
    throw new NotFoundException('ID de usuario inválido');
  }

  const products = await this.productModel.find({ vendedorId: userId }).exec();
  return products;
}
}
