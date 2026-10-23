import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { Pandit } from '../pandits/entities/pandit.entity';
import { AdminOperationsController } from './admin-operations.controller';
import { AdminOperationsService } from './admin-operations.service';
import { AppSetting } from './entities/app-setting.entity';
import { BookingHistory } from './entities/booking-history.entity';
import { CustomQuote } from './entities/custom-quote.entity';
import { NotificationLog } from './entities/notification-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Pandit,
      AppSetting,
      BookingHistory,
      CustomQuote,
      NotificationLog,
    ]),
  ],
  controllers: [AdminOperationsController],
  providers: [AdminOperationsService],
  exports: [AdminOperationsService],
})
export class AdminOperationsModule {}
