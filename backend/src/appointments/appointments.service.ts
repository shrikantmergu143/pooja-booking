import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsRepository.save(
      this.appointmentsRepository.create({ ...dto, email: dto.email || null }),
    );
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC', createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }
    Object.assign(appointment, dto);
    if (dto.email === '') appointment.email = null;
    return this.appointmentsRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Appointment not found.');
    }
  }
}
