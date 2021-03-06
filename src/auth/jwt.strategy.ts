import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { AuthService } from './auth.service';
import { IPayload } from '../types/payload';
import { ERROR_MESSAGES } from '../shared/ERROR_MESSAGES';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY,
        })
    }

    async validate(payload: IPayload, done: VerifiedCallback): Promise<void | VerifiedCallback> {
        const user = await this.authService.validateUser(payload);

        if (!user) {
            return done(
                new HttpException(ERROR_MESSAGES.UNAUTHORIZE, HttpStatus.UNAUTHORIZED),
                false
            )
        }
        return done(null, user, payload.iat)
    }
}