import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsArray, IsUUID, IsNumber } from 'class-validator';

export class CreatePoojaDto {
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsUUID()
  categoryId: string;

  @IsNotEmpty({ message: 'Pooja name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Slug is required' })
  @IsString()
  slug: string;

  @IsNotEmpty({ message: 'Short description is required' })
  @IsString()
  shortDescription: string;

  @IsNotEmpty({ message: 'Full description is required' })
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsArray()
  ritualRequirements?: string[];

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsUUID()
  defaultPanditId?: string;

  @IsOptional()
  @IsBoolean()
  allowCustomerPanditPreference?: boolean;

  @IsOptional()
  @IsInt()
  minAdvanceBookingHours?: number;

  @IsOptional()
  @IsInt()
  maxAdvanceBookingDays?: number;

  @IsOptional()
  @IsArray()
  supportedModes?: string[];

  @IsOptional()
  @IsArray()
  supportedLanguages?: string[];

  @IsOptional()
  @IsArray()
  supportedCities?: string[];

  @IsOptional()
  @IsArray()
  addons?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    isActive: boolean;
  }>;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  quote?: string;

  @IsOptional()
  @IsBoolean()
  allowCustomQuote?: boolean;

  @IsOptional()
  @IsNumber()
  customQuoteStartingPrice?: number;

  @IsOptional()
  @IsString()
  customQuoteNotes?: string;
}
