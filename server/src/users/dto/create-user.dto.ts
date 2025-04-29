import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsOptional()
    @IsUrl()
    profilePicture?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(10)
    bio?: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsNotEmpty()
    @IsIn(Object.values(UserRole))
    role: UserRole;
}