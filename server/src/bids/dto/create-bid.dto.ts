import { IsNumber, IsString, IsNotEmpty, Min, IsInt } from 'class-validator';

export class CreateBidDto {
    @IsNumber()
    @Min(0)
    amount: number;

    @IsString()
    @IsNotEmpty()
    proposal: string;

    @IsInt()
    @Min(1)
    projectId: number;

    @IsInt()
    @Min(1)
    freelancerId: number;
}