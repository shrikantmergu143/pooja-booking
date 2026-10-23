import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Customer } from './entities/customer.entity';
import { Pooja } from '../poojas/entities/pooja.entity';
import { Package } from '../packages/entities/package.entity';
import { Pandit } from '../pandits/entities/pandit.entity';
import { BookingHistory } from '../admin-operations/entities/booking-history.entity';
import { NotificationLog } from '../admin-operations/entities/notification-log.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Customer,
      Pooja,
      Package,
      Pandit,
      BookingHistory,
      NotificationLog,
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
