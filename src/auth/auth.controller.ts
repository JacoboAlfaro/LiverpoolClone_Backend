import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body); // 👈 pasa directamente al servicio
  }

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.login(body.email, body.password);

    // Guardar JWT en cookies HttpOnly
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, // ⚠️ true en producción con HTTPS
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    return { message: 'Login exitoso' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logout exitoso' };
  }
}
