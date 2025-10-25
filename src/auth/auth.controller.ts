import { Controller, Post, Body, Res, UseGuards, Get, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.authService.getUserByCorreo(email);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.login(body.email, body.password);

    // Guardar JWT en cookies HttpOnly
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, // ⚠️ true en producción con HTTPS
      sameSite: 'strict',
      maxAge: Number(process.env.COOKIE_MAX_AGE) || 60 * 60 * 1000, // 1 hora
    });

    return res.json({ message: 'Login exitoso' });
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return res.json({ message: 'Logout exitoso' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
  const email = req['user']?.email;
  const user = await this.authService.getUserByCorreo(email);

  if (!user) {
    return { message: 'Usuario no encontrado' };
  }
  return {
    ...user,
    id_user: (user as any)._id || user.id,
  };
}
}
