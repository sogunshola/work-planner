import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { ShiftEntity } from './shifts.entity';

export enum Role {
  WORKER = 'WORKER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  name: string;

  @Column({ enum: Role, default: Role.WORKER, type: 'enum' })
  role: Role;

  @OneToMany(() => ShiftEntity, shift => shift.user, { eager: true })
  shifts: ShiftEntity[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
