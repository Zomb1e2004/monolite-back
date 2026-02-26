import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/shared/services/logger.service';

import { hashPassword, comparePassword } from 'src/shared/utils/hashPassword';
import { generateId } from 'src/shared/utils/generateId';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {}

  async signUp(data: { username: string; email: string; password: string }) {
    const hashedPassword = await hashPassword(data.password);

    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      this.loggerService.warn(
        `Intento de registro con email ya existente: ${data.email}`,
      );

      throw new HttpException(
        'Este correo ya está en uso',
        HttpStatus.CONFLICT,
      );
    }

    await this.userService.create({
      id: generateId(),
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });
  }

  async signIn(data: { email: string; password: string }) {
    const user = await this.userService.findByEmail(data.email, true);
    if (!user) {
      this.loggerService.warn(
        `Intento de inicio de sesión con email no encontrado: ${data.email}`,
      );
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      this.loggerService.warn(
        `Intento de inicio de sesión con contraseña incorrecta para el email: ${data.email}`,
      );
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async getMe(token: string) {
    if (!token) throw new UnauthorizedException('Token no encontrado');

    try {
      const payload = this.jwtService.verify<{
        sub: string;
        username: string;
        email: string;
      }>(token);

      const user = await this.userService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
