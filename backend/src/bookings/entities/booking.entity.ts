import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Pooja } from '../../poojas/entities/pooja.entity';
import { Package } from '../../packages/entities/package.entity';
import { BookingStatus, BookingType } from '../../common/enums/booking-status.enum';
import { ServiceMode } from '../../common/enums/service-mode.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  bookingReference: string; // e.g. PB-20261025-1048

  @Column({ type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer, (c) => c.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ type: 'uuid', nullable: true })
  poojaId: string;

  @ManyToOne(() => Pooja, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'poojaId' })
  pooja: Pooja;

  @Column({ type: 'uuid', nullable: true })
  packageId: string;

  @ManyToOne(() => Package, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @Column({ type: 'uuid', nullable: true })
  assignedPanditId: string;

  @Column({
    type: 'enum',
    enum: BookingType,
    default: BookingType.STANDARD,
  })
  bookingType: BookingType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customPoojaName: string;

  @Column({ type: 'text', nullable: true })
  customRequirements: string;

  @Column({ type: 'int', default: 1 })
  participantCount: number;

  @Column({
    type: 'enum',
    enum: ServiceMode,
    default: ServiceMode.HOME,
  })
  serviceMode: ServiceMode;

  @Column({ type: 'jsonb', nullable: true })
  serviceAddressSnapshot: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'Hindi' })
  preferredLanguage: string;

  @Index()
  @Column({ type: 'timestamptz' })
  appointmentStartsAt: Date;

  @Index()
  @Column({ type: 'timestamptz' })
  appointmentEndsAt: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  approvedQuoteAmount: number;

  @Column({ type: 'jsonb', nullable: true })
  packageSnapshot: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  customerDetailsSnapshot: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  selectedAddonsSnapshot: Record<string, any>[];

  @Column({ type: 'text', nullable: true })
  customerNotes: string;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Index({ unique: true, where: '"idempotencyKey" IS NOT NULL' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  idempotencyKey: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  archivedAt: Date;
}
