import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get('packages')
  async getAllPackages() {
    const packages = await this.packagesService.findAll();
    return { success: true, data: packages };
  }

  @Get('packages/:id')
  async getPackageById(@Param('id') id: string) {
    const pkg = await this.packagesService.findById(id);
    return { success: true, data: pkg };
  }

  @Get('poojas/:poojaId/packages')
  async getPackagesForPooja(@Param('poojaId') poojaId: string) {
    const packages = await this.packagesService.findByPooja(poojaId);
    return { success: true, data: packages };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/packages')
  async createPackage(@Body() dto: CreatePackageDto) {
    const pkg = await this.packagesService.create(dto);
    return { success: true, data: pkg };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/packages/:id')
  async updatePackage(@Param('id') id: string, @Body() dto: Partial<CreatePackageDto>) {
    const pkg = await this.packagesService.update(id, dto);
    return { success: true, data: pkg };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/packages/:id')
  async deletePackage(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }
}

