import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';

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
  async signIn(@Body() data: { email: string; password: string }) {
    return this.authService.signIn(data);
  }
}
