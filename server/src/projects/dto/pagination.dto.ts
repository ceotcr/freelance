import { IsOptional, IsNumber, IsString, Min, Max, IsIn } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    @IsIn(['title', 'budget', 'postedAt', 'status'])
    sortBy?: string = 'postedAt';

    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}