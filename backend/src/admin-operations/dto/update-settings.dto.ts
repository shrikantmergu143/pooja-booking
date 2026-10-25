import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, IsUrl, Matches, MaxLength, Min, ValidateIf } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  websiteName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  websiteSubtitle?: string;

  @ValidateIf((_object, value) => value !== undefined && value !== '')
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @Matches(/^https?:\/\/[^/?#]+\/?$/i, {
    message: 'websiteDomain must contain only an HTTP(S) domain and optional trailing slash.',
  })
  @MaxLength(2048)
  websiteDomain?: string;

  @ValidateIf((_object, value) => value !== undefined && value !== '')
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  helplinePhone?: string;

  @ValidateIf((_object, value) => value !== undefined && value !== '')
  @IsEmail()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  serviceAddress?: string;

  @IsOptional()
  @IsString()
  serviceCity?: string;

  @IsOptional()
  @IsString()
  globalDefaultPanditId?: string;

  @IsOptional()
  @IsString()
  serviceTimeszone?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  minAdvanceBookingHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxAdvanceBookingDays?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  defaultSlotDurationMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  slotIntervalMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cancellationAllowedBeforeHours?: number;

  @IsOptional()
  @IsBoolean()
  enableCustomerPanditPreference?: boolean;
}
