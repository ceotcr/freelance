import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
    @IsNumber()
    amount: number;

    @IsString()
    @IsOptional()
    status?: string; // unpaid, paid, overdue

    @IsNotEmpty()
    freelancerId: number;

    @IsNotEmpty()
    projectId: number;
}
