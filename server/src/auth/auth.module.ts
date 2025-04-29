import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogoutLog, User } from 'src/exports/entities';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/common/constants/jwt.constants';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, LogoutLog]), JwtModule.register({
    global: true,
    secret: JWT_SECRET,
    signOptions: { expiresIn: '15m' },
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
