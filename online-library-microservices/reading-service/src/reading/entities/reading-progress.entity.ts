import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reading_progress')
export class ReadingProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  book_id: string;

  @Column({ type: 'int' })
  current_page: number;

  @Column({ type: 'float' })
  percentage_read: number;

  @Column({ type: 'varchar', default: 'in_progress' })
  status: 'in_progress' | 'completed';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
