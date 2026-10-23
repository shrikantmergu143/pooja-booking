import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Public endpoint
  @Get('categories')
  async getPublicCategories() {
    const categories = await this.categoriesService.findAll(true);
    return { success: true, data: categories };
  }

  @Get('categories/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    const category = await this.categoriesService.findBySlug(slug);
    return { success: true, data: category };
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard)
  @Get('admin/categories')
  async getAdminCategories() {
    const categories = await this.categoriesService.findAll(false);
    return { success: true, data: categories };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    return { success: true, data: category };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/categories/:id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const category = await this.categoriesService.update(id, dto);
    return { success: true, data: category };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
