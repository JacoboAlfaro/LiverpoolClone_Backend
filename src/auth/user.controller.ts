import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service'; // Importa el servicio UserService
import { UserDAO, UserDTO } from './interfaces/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Obtener todos los usuarios
  @Get()
  getAll(): Promise<UserDAO[]> {
    return this.userService.getAll();
  }

  // Obtener un usuario por ID
  @Get(':id')
  getById(@Param('id') id: string): Promise<UserDAO> {
    return this.userService.getById(id);
  }

  // Crear un nuevo usuario
  @Post()
  create(@Body() userDto: any): Promise<UserDAO> {
    return this.userService.create(userDto);
  }

  // Actualizar la información de un usuario
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() userDto: any): Promise<UserDAO> {
    return this.userService.updateUser(id, userDto);
  }

  // Actualizar el rol de un usuario
  @Put(':id/role')
  updateUserRole(@Param('id') id: string, @Body() role: { role: string }): Promise<UserDAO> {
    return this.userService.updateUserRole(id, role.role);
  }

  // Eliminar un usuario
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
