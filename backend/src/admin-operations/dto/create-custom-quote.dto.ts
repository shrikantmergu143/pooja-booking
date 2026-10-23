import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateCustomQuoteDto {
  @IsUUID()
  bookingId: string;

  @IsNumber()
  @Min(0.01)
  proposedAmount: number;

  @IsString()
  quoteDetails: string;

  @IsOptional()
  @IsString()
  exclusions?: string;

  @IsOptional()
  @IsUUID()
  assignedPanditId?: string;
}
