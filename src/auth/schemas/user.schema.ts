import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

@Schema({ collection: 'users' })
export class User {
  @Prop()
  state_id?: number;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido1: string;

  @Prop()
  apellido2: string;

  @Prop({ required: true, type: Date })
  fechaNacimiento: Date;

  @Prop({ required: true, enum: ['M', 'F'] })
  sexo: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, enum: ['admin', 'user', 'vendedor'] })
  role: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
