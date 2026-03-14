import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  name?: string = null;

  @Column()
  email: string;

  @Column()
  password: string;
}
