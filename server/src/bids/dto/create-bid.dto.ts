import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateBidDto {
    @IsNumber()
    amount: number;

    @IsString()
    proposal: string;

    @IsNotEmpty()
    freelancerId: number;

    @IsNotEmpty()
    projectId: number;
}
