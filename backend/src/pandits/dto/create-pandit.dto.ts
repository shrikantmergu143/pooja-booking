import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreatePanditDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsNumber()
  @IsOptional()
  experienceYears?: number;

  @IsArray()
  @IsOptional()
  specializations?: string[];

  @IsArray()
  @IsOptional()
  languages?: string[];

  @IsArray()
  @IsOptional()
  serviceAreas?: string[];

  @IsArray()
  @IsOptional()
  supportedCities?: string[];

  @IsArray()
  @IsOptional()
  eligiblePoojaIds?: string[];

  @IsArray()
  @IsOptional()
  supportedModes?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsOptional()
  weeklySchedule?: any[];

  @IsArray()
  @IsOptional()
  blockedDates?: any[];

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
