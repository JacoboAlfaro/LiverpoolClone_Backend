import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  marca: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  precio: number;

  @Prop()
  precioDescuento?: number;

  @Prop({ required: true })
  categoria: string;

  @Prop({ required: true })
  imagenes: string[]; // se guardan las URL de las imagenes

  @Prop({ required: true })
  colores: string[];

  @Prop({ required: true })
  tallas: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
