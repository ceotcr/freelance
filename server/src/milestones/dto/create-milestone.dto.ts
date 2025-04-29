// dto/create-milestone.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { MilestoneStatus } from '../entities/milestone.entity';

export class CreateMilestoneDto {
    @IsNotEmpty()
    title: string;

    @IsNumber()
    amount: number;

    @IsOptional()
    @IsEnum(MilestoneStatus)
    status?: MilestoneStatus;

    @IsNotEmpty()
    projectId: number;
}
