import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    projectId: number;
}