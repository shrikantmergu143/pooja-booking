import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { Pandit } from '../pandits/entities/pandit.entity';
import { Pooja } from '../poojas/entities/pooja.entity';
import { CreateCustomQuoteDto } from './dto/create-custom-quote.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AppSetting } from './entities/app-setting.entity';
import { BookingHistory } from './entities/booking-history.entity';
import { CustomQuote } from './entities/custom-quote.entity';
import { NotificationLog } from './entities/notification-log.entity';

const DEFAULT_SETTINGS = {
  businessName: 'Pooja Booking',
  helplinePhone: '',
  supportEmail: '',
  serviceAddress: '',
  serviceCity: '',
  globalDefaultPanditId: undefined,
  serviceTimeszone: 'Asia/Kolkata',
  minAdvanceBookingHours: 12,
  maxAdvanceBookingDays: 60,
  defaultSlotDurationMinutes: 120,
  slotIntervalMinutes: 90,
  cancellationAllowedBeforeHours: 24,
  enableCustomerPanditPreference: true,
};

@Injectable()
export class AdminOperationsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Pandit)
    private readonly panditRepository: Repository<Pandit>,
    @InjectRepository(AppSetting)
    private readonly settingsRepository: Repository<AppSetting>,
    @InjectRepository(BookingHistory)
    private readonly historyRepository: Repository<BookingHistory>,
    @InjectRepository(CustomQuote)
    private readonly quoteRepository: Repository<CustomQuote>,
    @InjectRepository(NotificationLog)
    private readonly notificationRepository: Repository<NotificationLog>,
    private readonly dataSource: DataSource,
  ) {}

  async getSettings() {
    let setting = await this.settingsRepository.findOne({ where: { key: 'default' } });
    if (!setting) {
      setting = this.settingsRepository.create({ key: 'default', value: DEFAULT_SETTINGS });
      setting = await this.settingsRepository.save(setting);
    }
    return { ...DEFAULT_SETTINGS, ...setting.value };
  }

  async updateSettings(patch: UpdateSettingsDto) {
    if (patch.globalDefaultPanditId) {
      const pandit = await this.panditRepository.findOne({
        where: { id: patch.globalDefaultPanditId, isActive: true },
      });
      if (!pandit) throw new NotFoundException('Global default Pandit must be an active account.');
    }
    const settings = { ...(await this.getSettings()), ...patch };
    if (patch.globalDefaultPanditId === '') settings.globalDefaultPanditId = undefined;
    await this.settingsRepository.save(
      this.settingsRepository.create({ key: 'default', value: settings }),
    );
    return settings;
  }

  async getCustomQuotes() {
    const quotes = await this.quoteRepository.find({ order: { createdAt: 'DESC' } });
    return quotes.map((quote) => ({ ...quote, proposedAmount: Number(quote.proposedAmount) }));
  }

  async createCustomQuote(dto: CreateCustomQuoteDto) {
    const quote = await this.dataSource.transaction(async (manager) => {
      const bookings = manager.getRepository(Booking);
      const quotes = manager.getRepository(CustomQuote);
      const history = manager.getRepository(BookingHistory);
      const notifications = manager.getRepository(NotificationLog);
      const booking = await bookings.findOne({
        where: { id: dto.bookingId },
        relations: ['customer', 'pooja'],
      });
      if (!booking) throw new NotFoundException('Booking not found.');
      if (booking.bookingType !== 'CUSTOM') {
        throw new BadRequestException('Quotes can only be created for custom bookings.');
      }
      if (![BookingStatus.AWAITING_CUSTOM_QUOTE, BookingStatus.QUOTE_SENT].includes(booking.status)) {
        throw new BadRequestException(`Cannot quote a booking with status '${booking.status}'.`);
      }
      if (dto.assignedPanditId) {
        const pandit = await manager.findOne(Pandit, { where: { id: dto.assignedPanditId, isActive: true } });
        if (!pandit) throw new NotFoundException('Active Pandit not found.');
        const overlap = await bookings
          .createQueryBuilder('existing')
          .where('existing.assignedPanditId = :panditId', { panditId: pandit.id })
          .andWhere('existing.status NOT IN (:...statuses)', {
            statuses: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
          })
          .andWhere(
            'existing.appointmentStartsAt < :endsAt AND existing.appointmentEndsAt > :startsAt',
            {
              startsAt: booking.appointmentStartsAt,
              endsAt: booking.appointmentEndsAt,
            },
          )
          .getOne();
        if (overlap && overlap.id !== booking.id) {
          throw new BadRequestException(
            `Pandit is already assigned to ${overlap.bookingReference} at this time.`,
          );
        }
      }

      const previousQuotes = await quotes.find({
        where: { bookingId: booking.id },
        order: { version: 'DESC' },
        take: 1,
      });
      await quotes.update({ bookingId: booking.id, status: 'SENT' }, { status: 'EXPIRED' });
      const now = new Date();
      const quote = quotes.create({
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        customerName: booking.customer.fullName,
        customerPhone: booking.customer.phone,
        customPoojaName: booking.customPoojaName || booking.pooja?.name || 'Custom Pooja',
        version: (previousQuotes[0]?.version || 0) + 1,
        proposedAmount: dto.proposedAmount,
        currency: booking.currency || 'INR',
        quoteDetails: dto.quoteDetails,
        exclusions: dto.exclusions,
        status: 'SENT',
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        assignedPanditId: dto.assignedPanditId,
        sentAt: now,
      });
      await quotes.save(quote);

      const previousStatus = booking.status;
      booking.status = BookingStatus.QUOTE_SENT;
      booking.price = dto.proposedAmount;
      booking.approvedQuoteAmount = dto.proposedAmount;
      if (dto.assignedPanditId) booking.assignedPanditId = dto.assignedPanditId;
      await bookings.save(booking);
      await history.save(
        history.create({
          bookingId: booking.id,
          previousStatus,
          newStatus: BookingStatus.QUOTE_SENT,
          newPanditId: dto.assignedPanditId,
          changedBy: 'Admin',
          eventType: 'QUOTE_SENT',
          notes: `Quotation sent: ${dto.proposedAmount} ${booking.currency}. ${dto.quoteDetails}`,
        }),
      );
      await notifications.save(
        notifications.create({
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
          notificationType: 'CUSTOM_QUOTE',
          recipient: booking.customer.email,
          subject: `Quotation prepared [${booking.bookingReference}]`,
          contentSnippet: `Quote for ${dto.proposedAmount} ${booking.currency} is ready.`,
          status: 'PENDING',
          attemptCount: 0,
        }),
      );
      return quote;
    });
    return { ...quote, proposedAmount: Number(quote.proposedAmount) };
  }

  async acceptCustomQuote(quoteId: string) {
    return this.dataSource.transaction(async (manager) => {
      const quotes = manager.getRepository(CustomQuote);
      const bookings = manager.getRepository(Booking);
      const history = manager.getRepository(BookingHistory);
      const notifications = manager.getRepository(NotificationLog);
      const quote = await quotes.findOne({ where: { id: quoteId } });
      if (!quote) throw new NotFoundException('Custom quote not found.');
      if (quote.status !== 'SENT' || quote.expiresAt < new Date()) {
        throw new BadRequestException('This quote is no longer available to accept.');
      }
      const booking = await bookings.findOne({
        where: { id: quote.bookingId },
        relations: ['customer'],
      });
      if (!booking) throw new NotFoundException('Booking for this quote was not found.');
      if (![BookingStatus.AWAITING_CUSTOM_QUOTE, BookingStatus.QUOTE_SENT].includes(booking.status)) {
        throw new BadRequestException(
          `Cannot accept a quote for a booking with status '${booking.status}'.`,
        );
      }
      const previousStatus = booking.status;
      quote.status = 'ACCEPTED';
      quote.acceptedAt = new Date();
      booking.status = BookingStatus.CONFIRMED;
      booking.price = quote.proposedAmount;
      booking.approvedQuoteAmount = quote.proposedAmount;
      booking.confirmedAt = new Date();
      if (quote.assignedPanditId) booking.assignedPanditId = quote.assignedPanditId;
      await quotes.save(quote);
      await bookings.save(booking);
      await history.save(
        history.create({
          bookingId: booking.id,
          previousStatus,
          newStatus: BookingStatus.CONFIRMED,
          previousPanditId: undefined,
          newPanditId: quote.assignedPanditId,
          changedBy: 'Admin',
          eventType: 'QUOTE_ACCEPTED',
          notes: `Accepted quote for ${quote.proposedAmount} ${quote.currency}.`,
        }),
      );
      await notifications.save(
        notifications.create({
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
          notificationType: 'CONFIRMATION',
          recipient: booking.customer?.email,
          subject: `Custom quote accepted [${booking.bookingReference}]`,
          contentSnippet: 'Your accepted custom quote has been confirmed.',
          status: 'PENDING',
          attemptCount: 0,
        }),
      );
      return true;
    });
  }

  async getDashboardStats() {
    const [bookings, totalBookings, activePanditsCount] = await Promise.all([
      this.bookingRepository.find({ where: { archivedAt: IsNull() } }),
      this.bookingRepository.count({ where: { archivedAt: IsNull() } }),
      this.panditRepository.count({ where: { isActive: true } }),
    ]);
    const today = new Date().toISOString().slice(0, 10);
    return {
      totalBookings,
      todayBookings: bookings.filter((booking) =>
        booking.appointmentStartsAt.toISOString().startsWith(today),
      ).length,
      upcomingAppointments: bookings.filter(
        (booking) =>
          [BookingStatus.CONFIRMED, BookingStatus.RESCHEDULED].includes(booking.status) &&
          booking.appointmentStartsAt >= new Date(),
      ).length,
      pendingConfirmations: bookings.filter((booking) => booking.status === BookingStatus.PENDING).length,
      awaitingCustomQuotes: bookings.filter(
        (booking) => booking.status === BookingStatus.AWAITING_CUSTOM_QUOTE,
      ).length,
      confirmedRevenue: bookings
        .filter((booking) => [BookingStatus.CONFIRMED, BookingStatus.COMPLETED].includes(booking.status))
        .reduce((total, booking) => total + Number(booking.price || 0), 0),
      activePanditsCount,
      completedBookings: bookings.filter((booking) => booking.status === BookingStatus.COMPLETED).length,
    };
  }

  async getNotificationLogs() {
    return this.notificationRepository.find({ order: { createdAt: 'DESC' } });
  }

  async retryNotification(id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('Notification log not found.');
    notification.attemptCount += 1;
    notification.status = 'FAILED';
    notification.errorMessage = 'No notification delivery provider is configured.';
    await this.notificationRepository.save(notification);
    throw new ServiceUnavailableException(notification.errorMessage);
  }

  async createNotification(data: Partial<NotificationLog>) {
    return this.notificationRepository.save(this.notificationRepository.create(data));
  }

  async getAvailableSlots(dateString: string, duration: number, poojaId?: string, panditId?: string) {
    const date = new Date(`${dateString}T00:00:00`);
    if (!Number.isFinite(date.getTime()) || !Number.isInteger(duration) || duration < 1) {
      throw new BadRequestException('A valid date and positive duration are required.');
    }
    const settings = await this.getSettings();
    const pooja = poojaId
      ? await this.dataSource.getRepository(Pooja).findOne({ where: { id: poojaId } })
      : null;
    if (poojaId && !pooja) throw new NotFoundException('Pooja not found.');
    const targetPanditId = panditId || pooja?.defaultPanditId || settings.globalDefaultPanditId;
    const targetPandit = targetPanditId
      ? await this.panditRepository.findOne({ where: { id: targetPanditId, isActive: true } })
      : await this.panditRepository.findOne({ where: { isActive: true }, order: { experienceYears: 'DESC' } });
    if (targetPanditId && !targetPandit) throw new NotFoundException('Active Pandit not found.');
    const daySchedule = targetPandit?.weeklySchedule?.find(
      (slot) => slot.dayOfWeek === date.getDay() && slot.isActive,
    );
    const noScheduleForDay = Boolean(targetPandit?.weeklySchedule?.length && !daySchedule);
    const minAdvanceHours = pooja?.minAdvanceBookingHours ?? Number(settings.minAdvanceBookingHours);
    const maxAdvanceDays = pooja?.maxAdvanceBookingDays ?? Number(settings.maxAdvanceBookingDays);
    const slotTimes = ['07:00', '08:30', '10:00', '11:30', '14:00', '15:30', '17:00', '18:30'];
    const eligibleSlots = daySchedule
      ? slotTimes.filter((time) => time >= daySchedule.startTime && time < daySchedule.endTime)
      : slotTimes;
    const booked = targetPandit
      ? await this.bookingRepository
          .createQueryBuilder('booking')
          .where('booking.assignedPanditId = :panditId', { panditId: targetPandit.id })
          .andWhere('booking.status NOT IN (:...statuses)', {
            statuses: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
          })
          .andWhere('booking.appointmentStartsAt < :dayEnd AND booking.appointmentEndsAt > :dayStart', {
            dayStart: date,
            dayEnd: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          })
          .getMany()
      : [];

    return eligibleSlots.map((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const startsAt = new Date(date);
      startsAt.setHours(hours, minutes, 0, 0);
      const endsAt = new Date(startsAt.getTime() + duration * 60 * 1000);
      const minDate = new Date(
        Date.now() + minAdvanceHours * 60 * 60 * 1000,
      );
      const maxDate = new Date(
        Date.now() + maxAdvanceDays * 24 * 60 * 60 * 1000,
      );
      const conflict = booked.some(
        (booking) =>
          booking.appointmentStartsAt < endsAt && booking.appointmentEndsAt > startsAt,
      );
      const blocked = targetPandit?.blockedDates?.some(
        (block) => new Date(block.startsAt) < endsAt && new Date(block.endsAt) > startsAt,
      );
      const outsideSchedule =
        daySchedule && endsAt > new Date(`${dateString}T${daySchedule.endTime}:00`);
      const outsideBookingWindow = startsAt < minDate || startsAt > maxDate;
      return {
        time,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        isAvailable: !conflict && !blocked && !outsideSchedule && !outsideBookingWindow && !noScheduleForDay,
        conflictReason: conflict
          ? 'Pandit has another booking during this time.'
          : blocked
            ? 'Pandit is unavailable during this time.'
            : noScheduleForDay
              ? 'Pandit is not scheduled to work on this day.'
              : outsideBookingWindow
                ? 'This time is outside the booking window.'
                : undefined,
        panditAssigned: targetPandit?.fullName,
      };
    });
  }
}
