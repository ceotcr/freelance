import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, Min, IsDateString, IsIn } from "class-validator";

export class FilterProjectsDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minBudget?: number;

    @IsOptional()
    @Type(() => Number)
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
    @IsIn(['open', 'in_progress', 'completed'])
    status?: string;
}