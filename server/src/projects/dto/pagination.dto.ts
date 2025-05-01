import { Transform, Type } from "class-transformer";
import { IsOptional, IsNumber, Min, Max, IsString, IsIn, IsDateString } from "class-validator";
export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    @IsIn(['title', 'budget', 'postedAt', 'status'])
    sortBy?: string = 'postedAt';

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.toUpperCase())
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}