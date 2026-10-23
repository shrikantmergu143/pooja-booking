import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PoojasService } from './poojas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePoojaDto } from './dto/create-pooja.dto';
import { UpdatePoojaDto } from './dto/update-pooja.dto';

@Controller('api/v1')
export class PoojasController {
  constructor(private readonly poojasService: PoojasService) {}

  // Public Endpoints
  @Get('poojas')
  async getPublicPoojas(@Query() query: { category?: string; mode?: string; search?: string }) {
    const poojas = await this.poojasService.findAll({
      categorySlug: query.category,
      mode: query.mode,
      search: query.search,
    });
    return { success: true, data: poojas };
  }

  @Get('poojas/:slug')
  async getPoojaBySlug(@Param('slug') slug: string) {
    const pooja = await this.poojasService.findBySlug(slug);
    return { success: true, data: pooja };
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard)
  @Get('admin/poojas')
  async getAdminPoojas() {
    const poojas = await this.poojasService.findAll(undefined, false);
    return { success: true, data: poojas };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/poojas')
  async createPooja(@Body() createPoojaDto: CreatePoojaDto) {
    const pooja = await this.poojasService.create(createPoojaDto);
    return { success: true, data: pooja };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/poojas/:id')
  async updatePooja(@Param('id') id: string, @Body() updateDto: UpdatePoojaDto) {
    const pooja = await this.poojasService.update(id, updateDto);
    return { success: true, data: pooja };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/poojas/:id')
  async deletePooja(@Param('id') id: string) {
    return this.poojasService.remove(id);
  }
}
