import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository, DataSource, EntityManager } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Customer } from './entities/customer.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateAdminBookingDto } from './dto/update-admin-booking.dto';
import { Package } from '../packages/entities/package.entity';
import { Pooja } from '../poojas/entities/pooja.entity';
import { BookingStatus, BookingType } from '../common/enums/booking-status.enum';
import { Pandit } from '../pandits/entities/pandit.entity';
import { BookingHistory } from '../admin-operations/entities/booking-history.entity';
import { NotificationLog } from '../admin-operations/entities/notification-log.entity';
import { AppSetting } from '../admin-operations/entities/app-setting.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Pooja)
    private readonly poojaRepository: Repository<Pooja>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Pandit)
    private readonly panditRepository: Repository<Pandit>,
    @InjectRepository(BookingHistory)
    private readonly historyRepository: Repository<BookingHistory>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    const bookings = await this.bookingRepository.find({
      where: { archivedAt: IsNull() },
      relations: ['customer', 'pooja', 'package', 'package.inclusions'],
      order: { createdAt: 'DESC' },
    });
    return this.formatBookings(bookings);
  }

  async findByReference(bookingReference: string, phoneEnding: string) {
    const normalizedEnding = (phoneEnding || '').replace(/\D/g, '');
    if (normalizedEnding.length < 4) {
      throw new BadRequestException('Provide at least the last four digits of the booking phone number.');
    }
    const booking = await this.bookingRepository.findOne({
      where: { bookingReference },
      relations: ['customer', 'pooja', 'package', 'package.inclusions'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    const phone = booking.customer.phone.replace(/\D/g, '');
    if (!phone.endsWith(normalizedEnding)) {
      throw new NotFoundException('Booking reference or phone verification did not match.');
    }
    return (await this.formatBookings([booking]))[0];
  }

  async findById(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['customer', 'pooja', 'package', 'package.inclusions'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return (await this.formatBookings([booking]))[0];
  }

  async findDetail(id: string) {
    const [booking, history] = await Promise.all([
      this.findById(id),
      this.historyRepository.find({ where: { bookingId: id }, order: { createdAt: 'ASC' } }),
    ]);
    return { booking, history };
  }

  private async formatBookings(bookings: Booking[]) {
    const panditIds = [...new Set(bookings.map((booking) => booking.assignedPanditId).filter(Boolean))];
    const pandits = panditIds.length
      ? await this.panditRepository.find({ where: { id: In(panditIds) } })
      : [];
    const panditNames = new Map(pandits.map((pandit) => [pandit.id, pandit.fullName]));
    return bookings.map((booking) => ({
      ...booking,
      price: Number(booking.price || 0),
      approvedQuoteAmount: booking.approvedQuoteAmount == null ? undefined : Number(booking.approvedQuoteAmount),
      poojaName: booking.customPoojaName || booking.pooja?.name || '',
      packageName: booking.package?.name,
      assignedPanditName: booking.assignedPanditId
        ? panditNames.get(booking.assignedPanditId)
        : undefined,
      serviceAddress: booking.serviceAddressSnapshot,
      selectedAddons: booking.selectedAddonsSnapshot || [],
      packageSnapshot: booking.packageSnapshot
        ? {
            ...booking.packageSnapshot,
            inclusions:
              booking.packageSnapshot.inclusions ||
              booking.package?.inclusions?.map((inclusion) => inclusion.title || inclusion.itemText) ||
              [],
          }
        : undefined,
    }));
  }

  async create(dto: CreateBookingDto, createdBy = 'Devotee') {
    if (dto.idempotencyKey) {
      const existing = await this.bookingRepository.findOne({
        where: { idempotencyKey: dto.idempotencyKey },
        relations: ['customer', 'pooja', 'package', 'package.inclusions'],
      });
      if (existing) return (await this.formatBookings([existing]))[0];
    }

    const bookingId = await this.dataSource.transaction(async (manager) => {
      const bookings = manager.getRepository(Booking);
      let pooja: Pooja | null = null;
      let pkg: Package | null = null;
      let durationMinutes = 120;
      let price = 0;

      if (dto.bookingType === BookingType.STANDARD) {
        if (!dto.poojaId || !dto.packageId) {
          throw new BadRequestException('Pooja and Package are required for standard bookings.');
        }
        pooja = await manager.findOne(Pooja, { where: { id: dto.poojaId, isActive: true } });
        if (!pooja) throw new NotFoundException('Pooja not found');

        pkg = await manager.findOne(Package, {
          where: { id: dto.packageId, poojaId: dto.poojaId, isActive: true },
          relations: ['inclusions'],
        });
        if (!pkg) throw new NotFoundException('Selected package not found');

        durationMinutes = pkg.durationMinutes;
        price = Number(pkg.price);
      } else if (!dto.customPoojaName?.trim()) {
        throw new BadRequestException('A name is required for custom bookings.');
      }

      const startsAt = new Date(dto.appointmentStartsAt);
      if (!Number.isFinite(startsAt.getTime())) {
        throw new BadRequestException('Appointment start time is invalid.');
      }
      const dateOfBirth = new Date(`${dto.customer.dateOfBirth}T00:00:00.000Z`);
      if (
        !Number.isFinite(dateOfBirth.getTime()) ||
        dateOfBirth.getTime() > Date.now()
      ) {
        throw new BadRequestException('Date of birth must be a valid date in the past.');
      }
      const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000);
      const targetPanditId =
        dto.preferredPanditId || pkg?.defaultPanditId || pooja?.defaultPanditId;
      if (pooja && !pooja.supportedModes?.includes(dto.serviceMode)) {
        throw new BadRequestException(`This Pooja is not available in ${dto.serviceMode} mode.`);
      }
      const storedSettings = await manager.getRepository(AppSetting).findOne({
        where: { key: 'default' },
      });
      const appSettings = storedSettings?.value || {};
      const minAdvanceHours =
        pooja?.minAdvanceBookingHours ??
        (typeof appSettings.minAdvanceBookingHours === 'number'
          ? appSettings.minAdvanceBookingHours
          : 12);
      const maxAdvanceDays =
        pooja?.maxAdvanceBookingDays ??
        (typeof appSettings.maxAdvanceBookingDays === 'number'
          ? appSettings.maxAdvanceBookingDays
          : 60);
      const now = Date.now();
      if (startsAt.getTime() < now + minAdvanceHours * 60 * 60 * 1000) {
        throw new BadRequestException(`Bookings must be made at least ${minAdvanceHours} hours in advance.`);
      }
      if (startsAt.getTime() > now + maxAdvanceDays * 24 * 60 * 60 * 1000) {
        throw new BadRequestException(`Bookings can only be made up to ${maxAdvanceDays} days in advance.`);
      }
      const selectedAddons = (pooja?.addons || []).filter(
        (addon) => addon.isActive && dto.selectedAddonIds?.includes(addon.id),
      );
      if (selectedAddons.length !== (dto.selectedAddonIds || []).length) {
        throw new BadRequestException('One or more selected add-ons are invalid or inactive.');
      }
      price += selectedAddons.reduce((total, addon) => total + Number(addon.price), 0);

      if (targetPanditId) {
        const pandit = await manager.findOne(Pandit, {
          where: { id: targetPanditId, isActive: true },
        });
        if (!pandit) throw new NotFoundException('Selected Pandit is not active or does not exist.');
        if (pandit.supportedModes?.length && !pandit.supportedModes.includes(dto.serviceMode)) {
          throw new BadRequestException('Selected Pandit does not support the requested service mode.');
        }
        if (
          pandit.eligiblePoojaIds?.length &&
          pooja &&
          !pandit.eligiblePoojaIds.includes(pooja.id)
        ) {
          throw new BadRequestException('Selected Pandit is not eligible for this Pooja.');
        }
        const daySchedule = pandit.weeklySchedule?.find(
          (slot) => slot.dayOfWeek === startsAt.getDay() && slot.isActive,
        );
        if (pandit.weeklySchedule?.length && !daySchedule) {
          throw new ConflictException('Selected Pandit is not available on this day.');
        }
        if (daySchedule) {
          const startTime = `${String(startsAt.getHours()).padStart(2, '0')}:${String(startsAt.getMinutes()).padStart(2, '0')}`;
          const endTime = `${String(endsAt.getHours()).padStart(2, '0')}:${String(endsAt.getMinutes()).padStart(2, '0')}`;
          if (startTime < daySchedule.startTime || endTime > daySchedule.endTime) {
            throw new ConflictException('Appointment is outside the Pandit weekly schedule.');
          }
        }
        const blocked = pandit.blockedDates?.some(
          (block) => new Date(block.startsAt) < endsAt && new Date(block.endsAt) > startsAt,
        );
        if (blocked) throw new ConflictException('Selected Pandit is blocked during this time.');
        const overlap = await bookings
          .createQueryBuilder('booking')
          .where('booking.assignedPanditId = :panditId', { panditId: targetPanditId })
          .andWhere('booking.status NOT IN (:...statuses)', {
            statuses: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
          })
          .andWhere(
            'booking.appointmentStartsAt < :endsAt AND booking.appointmentEndsAt > :startsAt',
            { startsAt, endsAt },
          )
          .getOne();
        if (overlap) {
          throw new ConflictException(
            `The selected Pandit already has an active appointment (${overlap.bookingReference}) during this interval.`,
          );
        }
      }

      let customer = await manager.findOne(Customer, { where: { phone: dto.customer.phone } });
      if (!customer) {
        customer = manager.create(Customer, {
          ...dto.customer,
          email: dto.customer.email?.trim() || null,
          countryCode: dto.customer.countryCode || '+91',
          preferredLanguage: dto.customer.preferredLanguage || 'Hindi',
        });
      } else {
        Object.assign(customer, {
          fullName: dto.customer.fullName,
          email: dto.customer.email?.trim() || customer.email || null,
          countryCode: dto.customer.countryCode || customer.countryCode,
          preferredLanguage: dto.customer.preferredLanguage || customer.preferredLanguage,
          gotra: dto.customer.gotra,
          rashi: dto.customer.rashi,
          dateOfBirth: dto.customer.dateOfBirth,
          birthPlace: dto.customer.birthPlace,
          sankalpNames: dto.customer.sankalpNames,
        });
      }
      customer = await manager.save(Customer, customer);

      const datePart = startsAt.toISOString().slice(0, 10).replace(/-/g, '');
      const booking = bookings.create({
        bookingReference: `PB-${datePart}-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: customer.id,
        customer,
        poojaId: pooja?.id,
        pooja,
        packageId: pkg?.id,
        package: pkg,
        assignedPanditId: targetPanditId,
        bookingType: dto.bookingType,
        customPoojaName: dto.customPoojaName,
        customRequirements: dto.customRequirements,
        participantCount: dto.participantCount || 1,
        serviceMode: dto.serviceMode,
        serviceAddressSnapshot: dto.serviceAddress,
        preferredLanguage: dto.customer.preferredLanguage || 'Hindi',
        appointmentStartsAt: startsAt,
        appointmentEndsAt: endsAt,
        status:
          dto.bookingType === BookingType.CUSTOM
            ? BookingStatus.AWAITING_CUSTOM_QUOTE
            : BookingStatus.PENDING,
        currency: 'INR',
        price,
        packageSnapshot: pkg
          ? {
              id: pkg.id,
              name: pkg.name,
              price,
              durationMinutes: pkg.durationMinutes,
              panditCount: pkg.panditCount,
              includesSamagri: pkg.includesSamagri,
              includesDakshina: pkg.includesDakshina,
              inclusions: pkg.inclusions?.map((inclusion) => inclusion.title || inclusion.itemText),
            }
          : null,
        customerDetailsSnapshot: {
          fullName: customer.fullName,
          phone: customer.phone,
          email: customer.email,
          gotra: customer.gotra,
          rashi: customer.rashi,
          dateOfBirth: customer.dateOfBirth,
          birthPlace: customer.birthPlace,
          sankalpNames: customer.sankalpNames,
        },
        selectedAddonsSnapshot: selectedAddons.map((addon) => ({
          addonId: addon.id,
          name: addon.name,
          price: Number(addon.price),
          quantity: 1,
        })),
        customerNotes: dto.customerNotes,
        idempotencyKey: dto.idempotencyKey,
      });
      const saved = await bookings.save(booking);
      await manager.getRepository(BookingHistory).save(
        manager.getRepository(BookingHistory).create({
          bookingId: saved.id,
          newStatus: saved.status,
          newPanditId: targetPanditId,
          changedBy: createdBy,
          eventType: 'CREATED',
          notes: 'Booking created.',
        }),
      );
      await manager.getRepository(NotificationLog).save(
        manager.getRepository(NotificationLog).create({
          bookingId: saved.id,
          bookingReference: saved.bookingReference,
          notificationType: 'BOOKING_RECEIVED',
          recipient: customer.email,
          subject: `Booking received [${saved.bookingReference}]`,
          contentSnippet: `Your booking for ${dto.customPoojaName || pooja?.name} has been received.`,
          status: 'PENDING',
          attemptCount: 0,
        }),
      );
      return saved.id;
    });
    return this.findById(bookingId);
  }

  private async saveHistory(
    manager: EntityManager,
    booking: Booking,
    data: Partial<BookingHistory>,
  ) {
    await manager.getRepository(BookingHistory).save(
      manager.getRepository(BookingHistory).create({
        bookingId: booking.id,
        previousStatus: booking.status,
        newStatus: booking.status,
        changedBy: 'Admin',
        ...data,
      }),
    );
  }

  private async saveNotification(
    manager: EntityManager,
    booking: Booking,
    type: string,
    subject: string,
    content: string,
  ) {
    const notifications = manager.getRepository(NotificationLog);
    await notifications.save(
      notifications.create({
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        notificationType: type,
        recipient: booking.customer?.email,
        subject,
        contentSnippet: content,
        status: 'PENDING',
        attemptCount: 0,
      }),
    );
  }

  private async assertNoConflict(
    manager: EntityManager,
    panditId: string | null,
    startsAt: Date,
    endsAt: Date,
    excludeBookingId: string,
  ) {
    if (!panditId) return;
    const conflict = await manager
      .getRepository(Booking)
      .createQueryBuilder('booking')
      .where('booking.assignedPanditId = :panditId', { panditId })
      .andWhere('booking.id != :excludeBookingId', { excludeBookingId })
      .andWhere('booking.status NOT IN (:...statuses)', {
        statuses: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
      })
      .andWhere('booking.appointmentStartsAt < :endsAt AND booking.appointmentEndsAt > :startsAt', {
        startsAt,
        endsAt,
      })
      .getOne();
    if (conflict) {
      throw new ConflictException(`Pandit is already assigned to ${conflict.bookingReference} at this time.`);
    }
  }

  async confirm(id: string, adminName: string, notes?: string) {
    await this.dataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({
        where: { id },
        relations: ['customer'],
      });
      if (!booking) throw new NotFoundException('Booking not found.');
      if (![BookingStatus.PENDING, BookingStatus.RESCHEDULED].includes(booking.status)) {
        throw new BadRequestException(`Cannot confirm booking with status '${booking.status}'.`);
      }
      if (!booking.assignedPanditId) {
        throw new BadRequestException('Assign a Pandit before confirming this booking.');
      }
      const previousStatus = booking.status;
      booking.status = BookingStatus.CONFIRMED;
      booking.confirmedAt = new Date();
      if (notes) booking.adminNotes = `${booking.adminNotes ? `${booking.adminNotes}\n` : ''}${notes}`;
      await manager.save(booking);
      await this.saveHistory(manager, booking, {
        previousStatus,
        newStatus: booking.status,
        changedBy: adminName,
        eventType: 'CONFIRMED',
        notes,
      });
      await this.saveNotification(
        manager,
        booking,
        'CONFIRMATION',
        `Appointment confirmed [${booking.bookingReference}]`,
        'Your booking has been confirmed.',
      );
    });
    return this.findById(id);
  }

  async reschedule(id: string, startsAtValue: string, adminName: string, notes?: string) {
    await this.dataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({
        where: { id },
        relations: ['customer'],
      });
      if (!booking) throw new NotFoundException('Booking not found.');
      if ([BookingStatus.CANCELLED, BookingStatus.COMPLETED].includes(booking.status)) {
        throw new BadRequestException(`Cannot reschedule a booking with status '${booking.status}'.`);
      }
      const startsAt = new Date(startsAtValue);
      if (!Number.isFinite(startsAt.getTime())) throw new BadRequestException('New appointment time is invalid.');
      const oldStartsAt = booking.appointmentStartsAt;
      const duration = booking.appointmentEndsAt.getTime() - oldStartsAt.getTime();
      const endsAt = new Date(startsAt.getTime() + duration);
      await this.assertNoConflict(manager, booking.assignedPanditId, startsAt, endsAt, booking.id);
      const previousStatus = booking.status;
      booking.appointmentStartsAt = startsAt;
      booking.appointmentEndsAt = endsAt;
      booking.status = BookingStatus.RESCHEDULED;
      await manager.save(booking);
      await this.saveHistory(manager, booking, {
        previousStatus,
        newStatus: booking.status,
        previousAppointmentStartsAt: oldStartsAt,
        newAppointmentStartsAt: startsAt,
        changedBy: adminName,
        eventType: 'RESCHEDULED',
        notes,
      });
      await this.saveNotification(manager, booking, 'RESCHEDULED', `Booking rescheduled [${booking.bookingReference}]`, 'Your appointment has been rescheduled.');
    });
    return this.findById(id);
  }

  async reassignPandit(id: string, panditId: string, adminName: string, notes?: string) {
    await this.dataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({
        where: { id },
        relations: ['customer'],
      });
      if (!booking) throw new NotFoundException('Booking not found.');
      if ([BookingStatus.CANCELLED, BookingStatus.COMPLETED].includes(booking.status)) {
        throw new BadRequestException(`Cannot reassign a booking with status '${booking.status}'.`);
      }
      const pandit = await manager.getRepository(Pandit).findOne({ where: { id: panditId, isActive: true } });
      if (!pandit) throw new NotFoundException('Active Pandit not found.');
      await this.assertNoConflict(
        manager,
        pandit.id,
        booking.appointmentStartsAt,
        booking.appointmentEndsAt,
        booking.id,
      );
      const previousPanditId = booking.assignedPanditId;
      booking.assignedPanditId = pandit.id;
      await manager.save(booking);
      await this.saveHistory(manager, booking, {
        previousPanditId,
        newPanditId: pandit.id,
        changedBy: adminName,
        eventType: 'REASSIGNED',
        notes,
      });
      await this.saveNotification(manager, booking, 'PANDIT_ASSIGNED', `Pandit assigned [${booking.bookingReference}]`, `Your ceremony is assigned to ${pandit.fullName}.`);
    });
    return this.findById(id);
  }

  async cancel(id: string, reason: string, adminName = 'Admin') {
    await this.dataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({
        where: { id },
        relations: ['customer'],
      });
      if (!booking) throw new NotFoundException('Booking not found.');
      if ([BookingStatus.CANCELLED, BookingStatus.COMPLETED].includes(booking.status)) {
        throw new BadRequestException(`Cannot cancel a booking with status '${booking.status}'.`);
      }
      const previousStatus = booking.status;
      booking.status = BookingStatus.CANCELLED;
      booking.cancelledAt = new Date();
      booking.adminNotes = `${booking.adminNotes ? `${booking.adminNotes}\n` : ''}Cancellation reason: ${reason}`;
      await manager.save(booking);
      await this.saveHistory(manager, booking, {
        previousStatus,
        newStatus: booking.status,
        changedBy: adminName,
        eventType: 'CANCELLED',
        notes: reason,
      });
      await this.saveNotification(manager, booking, 'CANCELLED', `Booking cancelled [${booking.bookingReference}]`, `Your booking was cancelled. ${reason}`);
    });
    return this.findById(id);
  }

  async complete(id: string, adminName: string) {
    await this.dataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({
        where: { id },
        relations: ['customer'],
      });
      if (!booking) throw new NotFoundException('Booking not found.');
      if (![BookingStatus.CONFIRMED, BookingStatus.RESCHEDULED].includes(booking.status)) {
        throw new BadRequestException('Only confirmed bookings can be completed.');
      }
      const previousStatus = booking.status;
      booking.status = BookingStatus.COMPLETED;
      booking.completedAt = new Date();
      await manager.save(booking);
      await this.saveHistory(manager, booking, {
        previousStatus,
        newStatus: booking.status,
        changedBy: adminName,
        eventType: 'COMPLETED',
      });
      await this.saveNotification(manager, booking, 'COMPLETED', `Booking completed [${booking.bookingReference}]`, 'Your ceremony has been marked complete.');
    });
    return this.findById(id);
  }

  async addNote(id: string, note: string, adminName: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!booking) throw new NotFoundException('Booking not found.');
    const status = booking.status;
    booking.adminNotes = `${booking.adminNotes ? `${booking.adminNotes}\n` : ''}${note}`;
    await this.bookingRepository.save(booking);
    await this.historyRepository.save(
      this.historyRepository.create({
        bookingId: booking.id,
        previousStatus: status,
        newStatus: status,
        changedBy: adminName,
        eventType: 'NOTE_ADDED',
        notes: note,
      }),
    );
    return this.findById(id);
  }

  async update(id: string, updateDto: UpdateAdminBookingDto, adminName = 'Admin'): Promise<Booking> {
    await this.dataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({
        where: { id, archivedAt: IsNull() },
        relations: ['customer'],
      });
      if (!booking) throw new NotFoundException('Booking not found.');

      if (updateDto.customer) {
        if (updateDto.customer.dateOfBirth) {
          const birthDate = new Date(`${updateDto.customer.dateOfBirth}T00:00:00.000Z`);
          if (!Number.isFinite(birthDate.getTime()) || birthDate.getTime() > Date.now()) {
            throw new BadRequestException('Date of birth must be a valid date in the past.');
          }
        }
        Object.assign(booking.customer, updateDto.customer);
        await manager.getRepository(Customer).save(booking.customer);
        booking.customerDetailsSnapshot = {
          ...(booking.customerDetailsSnapshot || {}),
          fullName: booking.customer.fullName,
          phone: booking.customer.phone,
          email: booking.customer.email,
          gotra: booking.customer.gotra,
          rashi: booking.customer.rashi,
          dateOfBirth: booking.customer.dateOfBirth,
          birthPlace: booking.customer.birthPlace,
        };
      }
      if (updateDto.serviceAddress) {
        booking.serviceAddressSnapshot = updateDto.serviceAddress;
      }
      if (updateDto.customerNotes !== undefined) {
        booking.customerNotes = updateDto.customerNotes;
      }
      await manager.getRepository(Booking).save(booking);
      await this.saveHistory(manager, booking, {
        changedBy: adminName,
        eventType: 'DETAILS_UPDATED',
        notes: 'Booking details updated by admin.',
      });
    });
    return this.findById(id);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    await this.dataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({ where: { id } });
      if (!booking) throw new NotFoundException('Booking not found.');
      if (booking.archivedAt) return;
      const previousStatus = booking.status;
      if (![BookingStatus.CANCELLED, BookingStatus.COMPLETED].includes(booking.status)) {
        booking.status = BookingStatus.CANCELLED;
        booking.cancelledAt = new Date();
      }
      booking.archivedAt = new Date();
      await manager.getRepository(Booking).save(booking);
      await manager.getRepository(BookingHistory).save(
        manager.getRepository(BookingHistory).create({
          bookingId: booking.id,
          previousStatus,
          newStatus: booking.status,
          changedBy: 'Admin',
          eventType: 'ARCHIVED',
          notes: 'Booking archived by admin.',
        }),
      );
    });
    return { success: true, message: 'Booking archived successfully.' };
  }
}
