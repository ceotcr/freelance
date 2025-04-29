import { IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "src/exports/entities";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsIn(Object.values(UserRole))
    role: UserRole;
}