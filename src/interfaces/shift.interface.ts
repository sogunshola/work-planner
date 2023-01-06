import { User } from './users.interface';

export enum ShiftTime {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  NIGHt = 'NIGHT',
}

export interface Shift {
  id: number;
  name: string;
  shiftDate: Date;
  shiftTime: ShiftTime;
  user?: User;
  checkin: Date | null;
  checkout: Date | null;
  completed: boolean;
}
