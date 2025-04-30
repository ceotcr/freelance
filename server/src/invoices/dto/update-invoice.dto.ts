import { IsNumber, IsOptional, Min, IsString, IsIn } from 'class-validator';

export class UpdateInvoiceDto {
    @IsNumber()
    @Min(0)
    @IsOptional()
    amount?: number;

    @IsString()
    @IsIn(['unpaid', 'paid', 'overdue'])
    @IsOptional()
    status?: string;
}