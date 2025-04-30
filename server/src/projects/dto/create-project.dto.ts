import { IsString, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';

    @IsNumber()
    @Min(0)
    @Max(1000000)
    budget: number;
}
