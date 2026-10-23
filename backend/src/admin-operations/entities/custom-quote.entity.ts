import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('custom_quotes')
export class CustomQuote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({ type: 'varchar', length: 50 })
  bookingReference: string;

  @Column({ type: 'varchar', length: 150 })
  customerName: string;

  @Column({ type: 'varchar', length: 20 })
  customerPhone: string;

  @Column({ type: 'varchar', length: 255 })
  customPoojaName: string;

  @Column({ type: 'int' })
  version: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  proposedAmount: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'text' })
  quoteDetails: string;

  @Column({ type: 'text', nullable: true })
  exclusions: string;

  @Column({ type: 'varchar', length: 20, default: 'SENT' })
  status: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ type: 'uuid', nullable: true })
  assignedPanditId: string;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  acceptedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  rejectedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
