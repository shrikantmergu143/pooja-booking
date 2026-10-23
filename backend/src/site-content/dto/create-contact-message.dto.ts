import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}

export class UpdateContactMessageDto {
  @IsOptional()
  @IsIn(['NEW', 'IN_PROGRESS', 'RESOLVED'])
  status?: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNotes?: string;
}
