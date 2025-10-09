import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(userData: User) {
    // Verificar si ya existe el correo
    const existingUser = await this.userModel.findOne({ email: userData.email }).exec();
    if (existingUser) throw new BadRequestException('El correo ya está registrado');

    if (!userData.password) {
      throw new BadRequestException('El campo password es obligatorio');
    }
    // Encriptar password
    const hashed = await bcrypt.hash(userData.password, 10);

    const createdUser = new this.userModel({
      ...userData,
      password: hashed,
    });

    const savedUser = await createdUser.save();

    return {
      message: 'Usuario registrado',
      user: this.formatUser(savedUser),
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Credenciales incorrectas');

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async getUserByCorreo(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return this.formatUser(user);
  }

  private formatUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      nombre: user.nombre,
      apellido1: user.apellido1,
      apellido2: user.apellido2,
      fechaNacimiento: user.fechaNacimiento,
      sexo: user.sexo,
      email: user.email,
    };
  }
}
