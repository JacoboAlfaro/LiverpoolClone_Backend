import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    // Leer token desde cookies
    const token = req.cookies?.['jwt'];
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    try {
      // Validar token
      const payload = await this.jwtService.verifyAsync(token);
      req['user'] = payload; // Guardamos payload en la request
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }
}
