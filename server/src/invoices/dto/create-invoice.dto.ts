import { IsNumber, Min, IsInt } from 'class-validator';

export class CreateInvoiceDto {
    @IsNumber()
    @Min(0)
    amount: number;

    @IsInt()
    @Min(1)
    projectId: number;

    @IsInt()
    @Min(1)
    freelancerId: number;
}