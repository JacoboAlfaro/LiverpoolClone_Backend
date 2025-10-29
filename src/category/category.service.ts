import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryWithChildren } from './category.schema';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';
import { CategoryNode } from './interfaces/category-node.interface';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel(dto);
    return category.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().lean();
  }

  async findWithChildren(id: string): Promise<any> {
    const parent = await this.categoryModel.findById(id);
    const children = await this.categoryModel.find({ parentId: new Types.ObjectId(id) });

    if (!parent) throw new NotFoundException("Categoría no encontrada");

    // Hacemos un cast explícito a CategoryWithChildren
    return { ...parent.toObject(), subcategories: children };
  }

  async findHierarchy(): Promise<CategoryNode[]> {
    const all = await this.categoryModel.find().lean<CategoryNode[]>();

    // Construir árbol jerárquico
    const buildTree = (parentId: string | null = null): CategoryNode[] =>
        all.filter((cat) => parentId ? cat.parentId?.toString() === parentId.toString() : !cat.parentId).map((cat) => ({
        ...cat,
            children: buildTree(cat._id.toString()),
        }));

    return buildTree();
    }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(id, dto, { new: true });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async remove(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete(id);
  }
}
