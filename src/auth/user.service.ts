import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserDAO, UserDTO } from './interfaces/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Crear un nuevo usuario
  async create(dto: UserDTO): Promise<any> {
    const user = new this.userModel(dto);
    const savedUser = await user.save();
    return {
      ...savedUser.toObject(),
      _id: savedUser._id.toString(),
    };
  }

  // Obtener todos los usuarios
  async getAll(): Promise<UserDAO[]> {
    const users = await this.userModel.find().lean<UserDAO[]>();
    return users.map(user => ({
      ...user,
      _id: user._id.toString(),
    }));
  }

  // Obtener un usuario por ID
  async getById(id: string): Promise<UserDAO> {
    const user = await this.userModel.findById(id).lean<UserDAO>();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return {
      ...user,
      _id: user._id.toString(),
    };
  }

  // Actualizar la información de un usuario
  async updateUser(id: string, dto: UserDTO): Promise<UserDAO> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, dto, { new: true }).lean<UserDAO>();
    if (!updatedUser) throw new NotFoundException('Usuario no encontrado');
    return {
      ...updatedUser,
      _id: updatedUser._id.toString(),
    };
  }

  // Actualizar el rol de un usuario
  async updateUserRole(id: string, role: string): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.role = role;
    await user.save();
    return {
      ...user.toObject(),
      _id: user._id.toString(),
    };
  }

  // Eliminar un usuario
  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Usuario no encontrado');
  }
}
