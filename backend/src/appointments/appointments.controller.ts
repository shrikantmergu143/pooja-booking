import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';

@Controller('api/v1')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('appointments')
  async createPublicAppointment(@Body() dto: CreateAppointmentDto) {
    return { success: true, data: await this.appointmentsService.create(dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/appointments')
  async getAppointments() {
    return { success: true, data: await this.appointmentsService.findAll() };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/appointments')
  async createAdminAppointment(@Body() dto: CreateAppointmentDto) {
    return { success: true, data: await this.appointmentsService.create(dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/appointments/:id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return { success: true, data: await this.appointmentsService.update(id, dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/appointments/:id')
  async deleteAppointment(@Param('id') id: string) {
    await this.appointmentsService.remove(id);
    return { success: true };
  }
}
