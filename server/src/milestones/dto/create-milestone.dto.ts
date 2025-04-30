import { IsString, IsNumber, IsNotEmpty, Min, IsInt } from 'class-validator';

export class CreateMilestoneDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsInt()
    @Min(1)
    projectId: number;
}