import { IsString, IsNumber, IsOptional, Min, IsIn } from 'class-validator';
import { MilestoneStatus } from '../entities/milestone.entity';

export class UpdateMilestoneDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    amount?: number;

    @IsOptional()
    @IsIn(Object.values(MilestoneStatus))
    status?: MilestoneStatus;
}