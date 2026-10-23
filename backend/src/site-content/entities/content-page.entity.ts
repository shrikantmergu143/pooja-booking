import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('content_pages')
@Unique('UQ_content_pages_slug', ['slug'])
export class ContentPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  slug: string;

  @Column({ type: 'varchar', length: 180 })
  title: string;

  @Column({ type: 'text', default: '' })
  contentHtml: string;

  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED';

  @Column({ type: 'varchar', length: 255, nullable: true })
  seoTitle: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  seoDescription: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
