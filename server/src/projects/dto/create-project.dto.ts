// dto/create-project.dto.ts
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNumber()
    budget: number;

    @IsOptional()
    clientId?: number;
}
