import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Pooja } from '../../poojas/entities/pooja.entity';
import { PackageInclusion } from './package-inclusion.entity';

@Entity('pooja_packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'pooja_id', type: 'uuid' })
  poojaId: string;

  /**
   * Many-to-One Relationship:
   * Each Package is linked to a specific Pooja ceremony with foreign key 'pooja_id'.
   */
  @ManyToOne(() => Pooja, (pooja) => pooja.packages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pooja_id' })
  pooja: Pooja;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ name: 'duration_minutes', type: 'int', default: 120 })
  durationMinutes: number;

  @Column({ name: 'pandit_count', type: 'int', default: 1 })
  panditCount: number;

  @Column({ name: 'includes_samagri', type: 'boolean', default: true })
  includesSamagri: boolean;

  @Column({ name: 'includes_dakshina', type: 'boolean', default: true })
  includesDakshina: boolean;

  @Column({ name: 'default_pandit_id', type: 'uuid', nullable: true })
  defaultPanditId: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  /**
   * One-to-Many Relationship:
   * A Package contains multiple line item inclusions.
   */
  @OneToMany(() => PackageInclusion, (inc) => inc.package, { cascade: true })
  inclusions: PackageInclusion[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
