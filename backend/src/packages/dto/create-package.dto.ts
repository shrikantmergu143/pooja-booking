import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, IsBoolean, IsUUID } from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty({ message: 'Pooja ID is required' })
  @IsUUID()
  poojaId: string;

  @IsNotEmpty({ message: 'Package name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsInt()
  panditCount?: number;

  @IsOptional()
  @IsBoolean()
  includesSamagri?: boolean;

  @IsOptional()
  @IsBoolean()
  includesDakshina?: boolean;

  @IsOptional()
  @IsUUID()
  defaultPanditId?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
