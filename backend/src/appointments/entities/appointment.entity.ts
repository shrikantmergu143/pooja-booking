import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('appointments')
@Index(['appointmentDate', 'appointmentTime'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  gotra: string;

  @Column({ type: 'varchar', length: 100 })
  rashi: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 180 })
  place: string;

  @Column({ type: 'date', nullable: true })
  appointmentDate: string;

  @Column({ type: 'time', nullable: true })
  appointmentTime: string;

  @Column({ type: 'varchar', length: 30 })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
