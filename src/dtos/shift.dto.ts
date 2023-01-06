import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ShiftTime } from '../interfaces/shift.interface';

export class CreateShiftDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  shiftDate: string;

  @IsEnum(ShiftTime)
  shiftTime: ShiftTime;

  @IsNotEmpty()
  userId: number;
}
