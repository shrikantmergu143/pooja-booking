import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  IsDateString,
  ValidateNested,
  IsArray,
  IsInt,
  Min,
  IsEmail,
  IsObject,
  Matches,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingType } from '../../common/enums/booking-status.enum';
import { ServiceMode } from '../../common/enums/service-mode.enum';

export class CustomerDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Phone number must contain exactly 10 digits.' })
  phone: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  gotra?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  rashi: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  birthPlace: string;

  @IsOptional()
  @IsArray()
  sankalpNames?: string[];
}

export class CustomerAddressDto {
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

export class CreateBookingDto {
  @IsEnum(BookingType)
  bookingType: BookingType;

  @IsOptional()
  @IsUUID()
  poojaId?: string;

  @IsOptional()
  @IsUUID()
  packageId?: string;

  @IsOptional()
  @IsString()
  customPoojaName?: string;

  @IsOptional()
  @IsString()
  customRequirements?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  participantCount?: number;

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsEnum(ServiceMode)
  serviceMode: ServiceMode;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerAddressDto)
  serviceAddress?: CustomerAddressDto;

  @IsNotEmpty()
  @IsDateString()
  appointmentStartsAt: string;

  @IsOptional()
  @IsUUID()
  preferredPanditId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedAddonIds?: string[];

  @IsOptional()
  @IsString()
  customerNotes?: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
