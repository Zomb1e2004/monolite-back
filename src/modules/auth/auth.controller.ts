import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import type { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sign-up')
  async signUp(
    @Body() data: { username: string; email: string; password: string },
  ) {
    return this.authService.signUp(data);
  }

  @Post('sign-in')
  async signIn(
    @Body() data: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.signIn(data);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Inicio de sesión exitoso' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'Sesión cerrada correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: RequestWithCookies) {
    const token = req.cookies['access_token'];
    return await this.authService.getMe(token);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('disable/:id')
  async disableUser(@Param('id') id: string, @Body('key') key: string) {
    return this.authService.disableUser(id, key);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('enable/:id')
  async enableUser(@Param('id') id: string, @Body('key') key: string) {
    return this.authService.enableUser(id, key);
  }
}
