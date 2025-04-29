import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JWT_SECRET } from 'src/common/constants/jwt.constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private authService: AuthService, private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    if (req?.cookies?.access_token) {
                        return req.cookies.access_token;
                    }

                    const authHeader = req?.headers?.authorization;
                    if (authHeader?.startsWith('Bearer ')) {
                        return authHeader.split(' ')[1];
                    }

                    return null;
                },
            ]),
            ignoreExpiration: false,
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
