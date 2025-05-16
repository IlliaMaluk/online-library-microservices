import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  genre: string;

  @Column('text')
  description: string;

  @Column({ type: 'int' })
  publication_year: number;

  @Column()
  file_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
