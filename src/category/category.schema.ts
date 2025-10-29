import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentId?: Types.ObjectId | null;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);

export type CategoryWithChildren = CategoryDocument & {
  subcategories: CategoryDocument[];
};
