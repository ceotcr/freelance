import { IsString, IsNumber, IsOptional, Min, IsIn, IsPositive, IsInt } from 'class-validator';

export class UpdateProjectDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsIn(["in_progress", "completed", "open", "cancelled"])
    status?: "in_progress" | "completed" | "open" | "cancelled";

    @IsNumber()
    @IsPositive()
    @IsOptional()
    budget?: number;
}