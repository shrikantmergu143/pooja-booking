import { PartialType } from '@nestjs/swagger';
import { CreatePoojaDto } from './create-pooja.dto';

export class UpdatePoojaDto extends PartialType(CreatePoojaDto) {}
