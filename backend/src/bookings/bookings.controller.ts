import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateAdminBookingDto } from './dto/update-admin-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('bookings')
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    const booking = await this.bookingsService.create(createBookingDto);
    return { success: true, data: booking };
  }

  @Get('bookings/:bookingReference')
  async getBookingByReference(
    @Param('bookingReference') ref: string,
    @Query('phoneEnding') phoneEnding: string,
  ) {
    const booking = await this.bookingsService.findByReference(ref, phoneEnding);
    return { success: true, data: booking };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/bookings')
  async createAdminBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: { user: { name: string } },
  ) {
    const booking = await this.bookingsService.create(createBookingDto, req.user.name);
    return { success: true, data: booking };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/bookings')
  async getAdminBookings() {
    const bookings = await this.bookingsService.findAll();
    return { success: true, data: bookings };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/bookings/:id')
  async getAdminBookingDetail(@Param('id') id: string) {
    return { success: true, data: await this.bookingsService.findDetail(id) };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/bookings/:id')
  async updateBooking(
    @Param('id') id: string,
    @Body() updateDto: UpdateAdminBookingDto,
    @Req() req: { user: { name: string } },
  ) {
    const booking = await this.bookingsService.update(id, updateDto, req.user.name);
    return { success: true, data: booking };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/bookings/:id/confirm')
  async confirmBooking(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @Req() req: { user: { name: string } },
  ) {
    const booking = await this.bookingsService.confirm(id, req.user.name, notes);
    return { success: true, data: booking };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/bookings/:id/reschedule')
  async rescheduleBooking(
    @Param('id') id: string,
    @Body() body: { startsAt: string; notes?: string },
    @Req() req: { user: { name: string } },
  ) {
    const booking = await this.bookingsService.reschedule(id, body.startsAt, req.user.name, body.notes);
    return { success: true, data: booking };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/bookings/:id/assign-pandit')
  async reassignPandit(
    @Param('id') id: string,
    @Body() body: { panditId: string; notes?: string },
    @Req() req: { user: { name: string } },
  ) {
    const booking = await this.bookingsService.reassignPandit(id, body.panditId, req.user.name, body.notes);
    return { success: true, data: booking };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/bookings/:id/cancel')
  async cancelBooking(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: { user: { name: string } },
  ) {
    const booking = await this.bookingsService.cancel(id, reason || 'Cancelled by admin', req.user.name);
    return { success: true, data: booking };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/bookings/:id/complete')
  async completeBooking(@Param('id') id: string, @Req() req: { user: { name: string } }) {
    const booking = await this.bookingsService.complete(id, req.user.name);
    return { success: true, data: booking };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/bookings/:id/notes')
  async addBookingNote(
    @Param('id') id: string,
    @Body('note') note: string,
    @Req() req: { user: { name: string } },
  ) {
    const booking = await this.bookingsService.addNote(id, note, req.user.name);
    return { success: true, data: booking };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/bookings/:id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
