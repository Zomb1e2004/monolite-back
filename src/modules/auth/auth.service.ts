import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { hashPassword, comparePassword } from 'src/shared/utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: { username: string; email: string; password: string }) {
    const hashedPassword = await hashPassword(data.password);

    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new HttpException(
        'Este correo ya está en uso',
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.userService.create({
      id: uuidv4(),
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async signIn(data: { email: string; password: string }) {
    const user = await this.userService.findByEmail(data.email, true);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
