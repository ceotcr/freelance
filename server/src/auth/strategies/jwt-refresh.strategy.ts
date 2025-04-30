import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/common/constants/jwt.constants';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private authService: AuthService, private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    if (req?.cookies?.refresh_token) {
                        return req.cookies.refresh_token;
                    }
                    return null;
                },
            ]),
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(payload: any) {
        await this.authService.validateTokenAgainstLogout(payload.sub, payload.iat);
        const user = await this.userService.findOne(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}
