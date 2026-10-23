import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Category } from '../categories/entities/category.entity';
import { Pooja } from '../poojas/entities/pooja.entity';
import { Package } from '../packages/entities/package.entity';
import { PackageInclusion } from '../packages/entities/package-inclusion.entity';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Customer } from '../bookings/entities/customer.entity';
import { Pandit } from '../pandits/entities/pandit.entity';
import { AppSetting } from '../admin-operations/entities/app-setting.entity';
import { BookingHistory } from '../admin-operations/entities/booking-history.entity';
import { CustomQuote } from '../admin-operations/entities/custom-quote.entity';
import { NotificationLog } from '../admin-operations/entities/notification-log.entity';
import { ContentPage } from '../site-content/entities/content-page.entity';
import { ContactMessage } from '../site-content/entities/contact-message.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'pooja_booking',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [
    Category,
    Pooja,
    Package,
    PackageInclusion,
    User,
    Booking,
    Customer,
    Pandit,
    AppSetting,
    BookingHistory,
    CustomQuote,
    NotificationLog,
    ContentPage,
    ContactMessage,
    Appointment,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
