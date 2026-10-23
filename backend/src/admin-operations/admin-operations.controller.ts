import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminOperationsService } from './admin-operations.service';
import { CreateCustomQuoteDto } from './dto/create-custom-quote.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('api/v1')
export class AdminOperationsController {
  constructor(private readonly adminOperationsService: AdminOperationsService) {}

  @Get('settings/public')
  async getPublicSettings() {
    return { success: true, data: await this.adminOperationsService.getSettings() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/settings')
  async getAdminSettings() {
    return { success: true, data: await this.adminOperationsService.getSettings() };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/settings')
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    return { success: true, data: await this.adminOperationsService.updateSettings(dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/custom-quotes')
  async getCustomQuotes() {
    return { success: true, data: await this.adminOperationsService.getCustomQuotes() };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/custom-quotes')
  async createCustomQuote(@Body() dto: CreateCustomQuoteDto) {
    return { success: true, data: await this.adminOperationsService.createCustomQuote(dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/custom-quotes/:id/accept')
  async acceptCustomQuote(@Param('id') id: string) {
    return { success: true, data: await this.adminOperationsService.acceptCustomQuote(id) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/dashboard/stats')
  async getDashboardStats() {
    return { success: true, data: await this.adminOperationsService.getDashboardStats() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/notifications')
  async getNotificationLogs() {
    return { success: true, data: await this.adminOperationsService.getNotificationLogs() };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/notifications/:id/retry')
  async retryNotification(@Param('id') id: string) {
    return { success: true, data: await this.adminOperationsService.retryNotification(id) };
  }

  @Get('availability/slots')
  async getAvailableSlots(
    @Query('date') date: string,
    @Query('duration') duration: string,
    @Query('poojaId') poojaId?: string,
    @Query('panditId') panditId?: string,
  ) {
    return {
      success: true,
      data: await this.adminOperationsService.getAvailableSlots(
        date,
        Number(duration),
        poojaId,
        panditId,
      ),
    };
  }
}
