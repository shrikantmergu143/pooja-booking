import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PoojasModule } from './poojas/poojas.module';
import { PackagesModule } from './packages/packages.module';
import { BookingsModule } from './bookings/bookings.module';
import { PanditsModule } from './pandits/pandits.module';
import { AdminOperationsModule } from './admin-operations/admin-operations.module';
import { SiteContentModule } from './site-content/site-content.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { I18nModule } from './common/i18n/i18n.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    I18nModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database'),
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    PoojasModule,
    PackagesModule,
    BookingsModule,
    PanditsModule,
    AdminOperationsModule,
    SiteContentModule,
    AppointmentsModule,
  ],
})
export class AppModule {}
