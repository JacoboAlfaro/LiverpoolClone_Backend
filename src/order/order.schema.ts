import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  metodoPago: string;

  @Prop({ type: Array, required: true })
  productos: {
    id: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  iva: number;

  @Prop({ required: true })
  envio: number;

  @Prop({ required: true })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
