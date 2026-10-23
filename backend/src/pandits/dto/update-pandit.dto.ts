import { PartialType } from '@nestjs/swagger';
import { CreatePanditDto } from './create-pandit.dto';

export class UpdatePanditDto extends PartialType(CreatePanditDto) {}
