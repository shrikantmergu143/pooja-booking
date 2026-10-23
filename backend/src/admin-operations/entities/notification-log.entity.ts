import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  bookingId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bookingReference: string;

  @Column({ type: 'varchar', length: 40 })
  notificationType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipient: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  contentSnippet: string;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: string;

  @Column({ type: 'int', default: 0 })
  attemptCount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerMessageId: string;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
