/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: RequestWithCookies) => {
        return req?.cookies?.['access_token'];
      },
      secretOrKey: process.env.JWT_SECRET || '',
      ignoreExpiration: false,
    });
  }

  validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }
}
