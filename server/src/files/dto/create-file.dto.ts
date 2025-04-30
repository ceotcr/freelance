import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateFileDto {
    @IsString()
    @IsOptional()
    fileName?: string;

    @IsString()
    @IsOptional()
    fileUrl?: string;

    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    userId: number;

    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    projectId: number;
}