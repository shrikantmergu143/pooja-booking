import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(activeOnly = true): Promise<Category[]> {
    const query = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.poojas', 'pooja', 'pooja.isActive = true')
      .orderBy('category.sortOrder', 'ASC');

    if (activeOnly) {
      query.where('category.isActive = :isActive', { isActive: true });
    }

    const categories = await query.getMany();
    return categories.map((category) =>
      Object.assign(category, { poojaCount: category.poojas?.length || 0 }),
    );
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['poojas'],
    });
    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async update(id: string, updateDto: Partial<CreateCategoryDto>): Promise<Category> {
    await this.categoryRepository.update(id, updateDto);
    const updated = await this.categoryRepository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async toggleActive(id: string, isActive: boolean): Promise<Category> {
    return this.update(id, { isActive });
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['poojas'] });
    if (!category) throw new NotFoundException('Category not found');
    await this.categoryRepository.remove(category);
    return { success: true, message: 'Category deleted successfully' };
  }
}
