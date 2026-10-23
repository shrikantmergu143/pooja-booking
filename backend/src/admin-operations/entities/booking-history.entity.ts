import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('booking_history')
export class BookingHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  previousStatus: string;

  @Column({ type: 'varchar', length: 40 })
  newStatus: string;

  @Column({ type: 'uuid', nullable: true })
  previousPanditId: string;

  @Column({ type: 'uuid', nullable: true })
  newPanditId: string;

  @Column({ type: 'timestamptz', nullable: true })
  previousAppointmentStartsAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  newAppointmentStartsAt: Date;

  @Column({ type: 'varchar', length: 150 })
  changedBy: string;

  @Column({ type: 'varchar', length: 40 })
  eventType: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
