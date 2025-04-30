import { IsNumber, IsString, IsOptional, Min, IsIn } from 'class-validator';

export class UpdateBidDto {
    @IsNumber()
    @Min(0)
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    proposal?: string;

    @IsOptional()
    @IsIn(['pending', 'accepted', 'rejected'])
    status?: 'pending' | 'accepted' | 'rejected';
}