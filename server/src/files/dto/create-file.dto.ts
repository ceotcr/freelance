import { IsNumber, IsOptional } from 'class-validator';

export class CreateFileDto {
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsNumber()
    projectId?: number;
}


export class ExtendedCreateFileDto extends CreateFileDto {
    fileName: string;
    fileUrl: string;
}