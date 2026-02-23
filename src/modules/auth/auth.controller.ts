import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
