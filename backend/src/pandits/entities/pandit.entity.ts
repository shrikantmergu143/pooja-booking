import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('pandits')
export class Pandit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 30 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ name: 'profile_image', type: 'varchar', length: 500, nullable: true })
  profileImage: string;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ name: 'experience_years', type: 'int', default: 5 })
  experienceYears: number;

  @Column({ name: 'specializations', type: 'simple-array', nullable: true })
  specializations: string[];

  @Column({ name: 'languages', type: 'simple-array', default: 'Hindi,Sanskrit' })
  languages: string[];

  @Column({ name: 'service_areas', type: 'simple-array', nullable: true })
  serviceAreas: string[];

  @Column({ name: 'supported_cities', type: 'simple-array', nullable: true })
  supportedCities: string[];

  @Column({ name: 'eligible_pooja_ids', type: 'simple-array', nullable: true })
  eligiblePoojaIds: string[];

  @Column({ name: 'supported_modes', type: 'simple-array', default: 'HOME,VENUE,ONLINE' })
  supportedModes: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'weekly_schedule', type: 'jsonb', nullable: true })
  weeklySchedule: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }>;

  @Column({ name: 'blocked_dates', type: 'jsonb', nullable: true })
  blockedDates: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    reason: string;
    createdAt: string;
  }>;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
