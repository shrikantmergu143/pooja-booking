import {
  IsEmail,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerAddressDto } from './create-booking.dto';

class UpdateBookingCustomerDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/)
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  gotra?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  rashi?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  birthPlace?: string;
}

export class UpdateAdminBookingDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateBookingCustomerDto)
  customer?: UpdateBookingCustomerDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerAddressDto)
  serviceAddress?: CustomerAddressDto;

  @IsOptional()
  @IsString()
  customerNotes?: string;
}
