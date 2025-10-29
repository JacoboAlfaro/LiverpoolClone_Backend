import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  vendedorId: Types.ObjectId;
  
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
  categorias: string[];

  @Prop({ required: true })
  imagenes: string[]; // se guardan las URL de las imagenes

  @Prop({ required: true })
  colores: string[];

  @Prop({ required: true })
  tallas: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
