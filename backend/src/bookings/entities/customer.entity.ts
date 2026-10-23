import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 10, default: '+91' })
  countryCode: string;

  @Column({ type: 'varchar', length: 50, default: 'Hindi' })
  preferredLanguage: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gotra: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rashi: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  birthPlace: string;

  @Column({ type: 'simple-array', nullable: true })
  sankalpNames: string[];

  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
