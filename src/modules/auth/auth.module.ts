import 'dotenv/config';

import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggerService } from 'src/shared/services/logger.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LoggerService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
