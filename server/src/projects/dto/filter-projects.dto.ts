import { IsOptional, IsString, IsNumber, Min, IsDateString, IsIn } from 'class-validator';

export class FilterProjectsDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    minBudget?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    maxBudget?: number;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsString()
    @IsIn(['pending', 'in_progress', 'completed'])
    status?: string;
}