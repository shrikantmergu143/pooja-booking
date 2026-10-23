import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pandit } from './entities/pandit.entity';
import { PanditsService } from './pandits.service';
import { PanditsController } from './pandits.controller';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pandit, Booking])],
  controllers: [PanditsController],
  providers: [PanditsService],
  exports: [PanditsService],
})
export class PanditsModule {}
