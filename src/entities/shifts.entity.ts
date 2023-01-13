import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Shift, ShiftTime } from '../interfaces/shift.interface';
import { UserEntity } from './users.entity';

@Entity()
export class ShiftEntity extends BaseEntity implements Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  shiftDate: string;

  @Column({ enum: ShiftTime, type: 'enum' })
  shiftTime: ShiftTime;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, user => user.shifts)
  user: UserEntity;

  @Column({ nullable: true })
  checkin: Date | null;

  @Column({ nullable: true })
  checkout: Date | null;

  @Column({ default: false })
  completed: boolean;
}
