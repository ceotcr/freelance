import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogoutLog } from 'src/exports/entities';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { ACCESS_TOKEN_COOKIE_EXPIRATION, REFRESH_TOKEN_COOKIE_EXPIRATION } from 'src/common/constants/jwt.constants';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, @InjectRepository(LogoutLog) private readonly logoutLogRepository: Repository<LogoutLog>,
        private readonly jwtService: JwtService
    ) { }

    async login({ username, password }: LoginDto, res: Response) {
        const user = await this.usersService.getUserByUserName(username, true);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = { username: user.username, role: user.role, sub: user.id };

        const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

        res.cookie('access_token', access_token, { httpOnly: true, secure: false, sameSite: "strict", expires: new Date(Date.now() + ACCESS_TOKEN_COOKIE_EXPIRATION) });
        res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: false, sameSite: "strict", expires: new Date(Date.now() + REFRESH_TOKEN_COOKIE_EXPIRATION) });
        const { password: pswd, ...userWithoutPassword } = user;
        return res.status(200).json({
            access_token,
            refresh_token,
            user: userWithoutPassword
        });
    }

    async register({
        username,
        password,
        role,
        firstName,
        lastName,
        email,
    }: RegisterDto) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersService.create({
            username,
            password: hashedPassword,
            role,
            firstName,
            lastName,
            email,
        });
        return {
            message: 'User registered successfully',
        }
    }
    async logout({ userAgent, ipAddress, res, req }: { userAgent: string; ipAddress: string; res: Response; req: Request }) {
        console.log(req.user)
        if (!req.user) {
            throw new UnauthorizedException('User not found');
        }
        const userId = req.user['id'];
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const logoutLog = this.logoutLogRepository.create({ user, userAgent, ipAddress, logoutTime: new Date() });
        await this.logoutLogRepository.save(logoutLog);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(200).json({
            message: 'Logged out successfully',
        });
    }

    async validateTokenAgainstLogout(userId: number, tokenIat: number) {
        const latestLogout = await this.logoutLogRepository.findOne({
            where: { user: { id: userId } },
            order: { logoutTime: 'DESC' },
        });
        if (latestLogout && latestLogout.logoutTime.getTime() / 1000 > tokenIat) {
            throw new UnauthorizedException('Token invalid due to logout.');
        }
    }

    async refresh(req: Request, res: Response) {
        if (!req.user) throw new UnauthorizedException();

        const user = req.user;
        const payload = { username: user.username, role: user.role, sub: user.id };
        const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + ACCESS_TOKEN_COOKIE_EXPIRATION),
        });

        const { password, ...userWithoutPassword } = await this.usersService.findOne(user.id);

        return res.status(200).json({
            access_token: newAccessToken,
            user: userWithoutPassword
        });
    }
    async getMe(id: number) {
        const user = await this.usersService.findOne(id)
        if (!user) throw new UnauthorizedException()
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}
