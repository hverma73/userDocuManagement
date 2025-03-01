import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' }) // Store document content
  content: string;

  @Column()
  uploadedBy: number; // Reference to user ID
}
