import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePoojaDto } from './dto/update-pooja.dto.js';
import { Pooja } from './entities/pooja.entity.js';
import { CreatePoojaDto } from './dto/create-pooja.dto.js';

@Injectable()
export class PoojasService {
  constructor(
    @InjectRepository(Pooja)
    private readonly poojaRepository: Repository<Pooja>,
  ) {}

  async findAll(
    query?: { categorySlug?: string; mode?: string; search?: string },
    activeOnly = true,
  ): Promise<Pooja[]> {
    const qb = this.poojaRepository.createQueryBuilder('pooja')
      .leftJoinAndSelect('pooja.category', 'category')
      .leftJoinAndSelect('pooja.packages', 'package', 'package.isActive = true')
      .leftJoinAndSelect('package.inclusions', 'inclusion')
      .orderBy('pooja.name', 'ASC');
    if (activeOnly) qb.where('pooja.isActive = :isActive', { isActive: true });

    if (query?.categorySlug) {
      qb.andWhere('category.slug = :categorySlug', { categorySlug: query.categorySlug });
    }

    if (query?.search) {
      qb.andWhere(
        '(LOWER(pooja.name) LIKE LOWER(:search) OR LOWER(pooja.shortDescription) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    if (query?.mode) {
      qb.andWhere(":mode = ANY(string_to_array(pooja.supportedModes, ','))", {
        mode: query.mode.toUpperCase(),
      });
    }

    return (await qb.getMany()).map((pooja) => this.formatPooja(pooja));
  }

  async findBySlug(slug: string): Promise<Pooja> {
    const pooja = await this.poojaRepository.findOne({
      where: { slug, isActive: true },
      relations: ['category', 'packages', 'packages.inclusions'],
      order: {
        packages: {
          sortOrder: 'ASC',
          inclusions: {
            sortOrder: 'ASC',
          },
        },
      },
    });

    if (!pooja) throw new NotFoundException(`Pooja with slug '${slug}' not found`);
    return this.formatPooja(pooja);
  }

  async findById(id: string): Promise<Pooja> {
    const pooja = await this.poojaRepository.findOne({
      where: { id },
      relations: ['category', 'packages'],
    });
    if (!pooja) throw new NotFoundException('Pooja not found');
    return this.formatPooja(pooja);
  }

  async create(createPoojaDto: CreatePoojaDto): Promise<Pooja> {
    const pooja = this.poojaRepository.create(createPoojaDto);
    return this.poojaRepository.save(pooja);
  }

  async update(id: string, updateDto: UpdatePoojaDto): Promise<Pooja> {
    await this.poojaRepository.update(id, updateDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const pooja = await this.findById(id);
    await this.poojaRepository.remove(pooja);
    return { success: true, message: 'Pooja ceremony deleted successfully' };
  }

  private formatPooja(pooja: Pooja): Pooja {
    return Object.assign(pooja, {
      categoryName: pooja.category?.name,
      addons: pooja.addons || [],
      packages: (pooja.packages || []).map((pkg) =>
        Object.assign(pkg, {
          price: Number(pkg.price),
          inclusions: (pkg.inclusions || []).map((inclusion) =>
            Object.assign(inclusion, {
              title: inclusion.title || inclusion.itemText || '',
            }),
          ),
        }),
      ),
    });
  }
}
