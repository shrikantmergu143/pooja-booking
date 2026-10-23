import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';
import { CreatePackageDto } from './dto/create-package.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async findAll(): Promise<Package[]> {
    return this.packageRepository.find({
      relations: ['inclusions', 'pooja'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findByPooja(poojaId: string): Promise<Package[]> {
    return this.packageRepository.find({
      where: { poojaId, isActive: true },
      relations: ['inclusions'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findById(id: string): Promise<Package> {
    const pkg = await this.packageRepository.findOne({
      where: { id },
      relations: ['inclusions', 'pooja'],
    });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async create(dto: CreatePackageDto): Promise<Package> {
    const pkg = this.packageRepository.create(dto);
    return this.packageRepository.save(pkg);
  }

  async update(id: string, updateDto: Partial<CreatePackageDto>): Promise<Package> {
    await this.packageRepository.update(id, updateDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const pkg = await this.findById(id);
    await this.packageRepository.remove(pkg);
    return { success: true, message: 'Package deleted successfully' };
  }
}

