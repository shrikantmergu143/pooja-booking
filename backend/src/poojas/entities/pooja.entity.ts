import { ServiceMode } from '../../common/enums/service-mode.enum';
import { Category } from '../../categories/entities/category.entity';
import { Package } from '../../packages/entities/package.entity';
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

@Entity('poojas')
export class Pooja {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  /**
   * Many-to-One Relationship:
   * Each Pooja belongs to a single Category with foreign key 'category_id'.
   */
  @ManyToOne(() => Category, (category) => category.poojas, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 200, unique: true })
  slug: string;

  @Column({ name: 'short_description', type: 'varchar', length: 500 })
  shortDescription: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ name: 'ritual_requirements', type: 'simple-array', nullable: true })
  ritualRequirements: string[];

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ name: 'duration_minutes', type: 'int', default: 120 })
  durationMinutes: number;

  @Column({ name: 'default_pandit_id', type: 'uuid', nullable: true })
  defaultPanditId: string;

  @Column({ name: 'allow_customer_pandit_preference', type: 'boolean', default: true })
  allowCustomerPanditPreference: boolean;

  @Column({ name: 'min_advance_booking_hours', type: 'int', default: 12 })
  minAdvanceBookingHours: number;

  @Column({ name: 'max_advance_booking_days', type: 'int', default: 60 })
  maxAdvanceBookingDays: number;

  @Column({
    name: 'supported_modes',
    type: 'simple-array',
    default: `${ServiceMode.HOME},${ServiceMode.VENUE},${ServiceMode.ONLINE}`,
  })
  supportedModes: string[];

  @Column({ name: 'supported_languages', type: 'simple-array', default: 'Hindi,Sanskrit' })
  supportedLanguages: string[];

  @Column({ name: 'supported_cities', type: 'simple-array', nullable: true })
  supportedCities: string[];

  @Column({ type: 'jsonb', nullable: true })
  addons: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    isActive: boolean;
  }>;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'seo_title', type: 'varchar', length: 255, nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', type: 'text', nullable: true })
  seoDescription: string;

  @Column({ type: 'text', nullable: true })
  quote: string;

  @Column({ name: 'allow_custom_quote', type: 'boolean', default: true })
  allowCustomQuote: boolean;

  @Column({ name: 'custom_quote_starting_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  customQuoteStartingPrice: number;

  @Column({ name: 'custom_quote_notes', type: 'text', nullable: true })
  customQuoteNotes: string;

  /**
   * One-to-Many Relationship:
   * A Pooja offers multiple tiered Packages (Simple, Standard, Grand).
   */
  @OneToMany(() => Package, (pkg) => pkg.pooja, { cascade: true })
  packages: Package[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
