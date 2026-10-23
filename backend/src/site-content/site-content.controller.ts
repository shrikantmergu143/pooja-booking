import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateContentPageDto,
  UpdateContentPageDto,
} from './dto/create-content-page.dto';
import {
  CreateContactMessageDto,
  UpdateContactMessageDto,
} from './dto/create-contact-message.dto';
import { SiteContentService } from './site-content.service';

@Controller('api/v1')
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get('content-pages/:slug')
  async getPublicPage(@Param('slug') slug: string) {
    return { success: true, data: await this.siteContentService.getPublicPage(slug) };
  }

  @Post('contact-messages')
  async createContactMessage(
    @Body() dto: CreateContactMessageDto,
    @Req() req: { ip?: string },
  ) {
    return {
      success: true,
      data: await this.siteContentService.createContactMessage(dto, req.ip),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/content-pages')
  async getAdminPages() {
    return { success: true, data: await this.siteContentService.getAdminPages() };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/content-pages')
  async createPage(@Body() dto: CreateContentPageDto) {
    return { success: true, data: await this.siteContentService.createPage(dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/content-pages/:slug')
  async updatePage(@Param('slug') slug: string, @Body() dto: UpdateContentPageDto) {
    return { success: true, data: await this.siteContentService.updatePage(slug, dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/content-pages/:slug')
  async deletePage(@Param('slug') slug: string) {
    return { success: true, data: await this.siteContentService.deletePage(slug) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/contact-messages')
  async getContactMessages() {
    return { success: true, data: await this.siteContentService.getContactMessages() };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/contact-messages/:id')
  async updateContactMessage(
    @Param('id') id: string,
    @Body() dto: UpdateContactMessageDto,
  ) {
    return {
      success: true,
      data: await this.siteContentService.updateContactMessage(id, dto),
    };
  }
}
