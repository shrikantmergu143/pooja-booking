import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { Pandit } from './entities/pandit.entity';
import { Repository } from 'typeorm';
import { CreatePanditDto } from './dto/create-pandit.dto';
import { UpdatePanditDto } from './dto/update-pandit.dto';
import { BookingStatus } from '../common/enums/booking-status.enum';

@Injectable()
export class PanditsService {
  constructor(
    @InjectRepository(Pandit)
    private readonly panditRepository: Repository<Pandit>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async findAll(activeOnly = false): Promise<Pandit[]> {
    if (activeOnly) {
      return this.panditRepository.find({
        where: { isActive: true },
        order: { experienceYears: 'DESC' },
      });
    }
    return this.panditRepository.find({
      order: { experienceYears: 'DESC' },
    });
  }

  async findById(id: string): Promise<Pandit> {
    const pandit = await this.panditRepository.findOne({ where: { id } });
    if (!pandit) {
      throw new NotFoundException(`Pandit with ID '${id}' not found`);
    }
    return pandit;
  }

  async create(dto: CreatePanditDto): Promise<Pandit> {
    const pandit = this.panditRepository.create(dto);
    return this.panditRepository.save(pandit);
  }

  async update(id: string, updateDto: UpdatePanditDto): Promise<Pandit> {
    const pandit = await this.findById(id);
    Object.assign(pandit, updateDto);
    return this.panditRepository.save(pandit);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const pandit = await this.findById(id);

    // Active bookings safeguard
    const activeBookingCount = await this.bookingRepository.count({
      where: {
        assignedPanditId: id,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (activeBookingCount > 0) {
      throw new BadRequestException(
        `Cannot delete Priest: There are ${activeBookingCount} confirmed booking(s) currently assigned. Please reassign their ceremonies first or toggle active status to false.`,
      );
    }

    await this.panditRepository.remove(pandit);
    return { success: true, message: 'Priest profile permanently deleted.' };
  }

  async updateSchedule(id: string, weeklySchedule: any[]): Promise<Pandit> {
    const pandit = await this.findById(id);
    pandit.weeklySchedule = weeklySchedule;
    return this.panditRepository.save(pandit);
  }

  async addBlockedDate(
    id: string,
    data: { startsAt: string; endsAt: string; reason: string },
  ): Promise<Pandit> {
    const pandit = await this.findById(id);
    const blockedDates = pandit.blockedDates || [];
    blockedDates.push({
      id: `blk-${Date.now()}`,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      reason: data.reason,
      createdAt: new Date().toISOString(),
    });
    pandit.blockedDates = blockedDates;
    return this.panditRepository.save(pandit);
  }

  async removeBlockedDate(id: string, blockId: string): Promise<Pandit> {
    const pandit = await this.findById(id);
    pandit.blockedDates = (pandit.blockedDates || []).filter((b) => b.id !== blockId);
    return this.panditRepository.save(pandit);
  }
}
