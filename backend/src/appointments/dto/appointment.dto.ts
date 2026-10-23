import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  gotra: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  rashi: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  place: string;

  @IsDateString()
  appointmentDate: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  appointmentTime: string;

  @IsString()
  @Matches(/^\+?[0-9\s()-]{7,30}$/)
  mobileNumber: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  gotra?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  rashi?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  place?: string;

  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  appointmentTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s()-]{7,30}$/)
  mobileNumber?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string | null;
}
