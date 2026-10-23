import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PanditsService } from './pandits.service';
import { CreatePanditDto } from './dto/create-pandit.dto';
import { UpdatePanditDto } from './dto/update-pandit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1')
export class PanditsController {
  constructor(private readonly panditsService: PanditsService) {}

  // Public endpoint
  @Get('pandits')
  async getPublicPandits() {
    const pandits = await this.panditsService.findAll(true);
    return { success: true, data: pandits };
  }

  @Get('pandits/:id')
  async getPanditById(@Param('id') id: string) {
    const pandit = await this.panditsService.findById(id);
    return { success: true, data: pandit };
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard)
  @Get('admin/pandits')
  async getAdminPandits() {
    const pandits = await this.panditsService.findAll(false);
    return { success: true, data: pandits };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/pandits')
  async createPandit(@Body() createPanditDto: CreatePanditDto) {
    const pandit = await this.panditsService.create(createPanditDto);
    return { success: true, data: pandit };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/pandits/:id')
  async updatePandit(
    @Param('id') id: string,
    @Body() updateDto: UpdatePanditDto,
  ) {
    const pandit = await this.panditsService.update(id, updateDto);
    return { success: true, data: pandit };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/pandits/:id')
  async deletePandit(@Param('id') id: string) {
    return this.panditsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/pandits/:id/schedule')
  async updateSchedule(
    @Param('id') id: string,
    @Body('weeklySchedule') weeklySchedule: any[],
  ) {
    const pandit = await this.panditsService.updateSchedule(id, weeklySchedule);
    return { success: true, data: pandit };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/pandits/:id/blocked-dates')
  async addBlockedDate(
    @Param('id') id: string,
    @Body() body: { startsAt: string; endsAt: string; reason: string },
  ) {
    const pandit = await this.panditsService.addBlockedDate(id, body);
    return { success: true, data: pandit };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/pandits/:id/blocked-dates/:blockId')
  async removeBlockedDate(
    @Param('id') id: string,
    @Param('blockId') blockId: string,
  ) {
    const pandit = await this.panditsService.removeBlockedDate(id, blockId);
    return { success: true, data: pandit };
  }
}
