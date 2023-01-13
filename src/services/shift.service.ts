import { isEmpty } from '@utils/util';
import { EntityRepository, Equal, Repository } from 'typeorm';
import { CreateShiftDto } from '../dtos/shift.dto';
import { ShiftEntity } from '../entities/shifts.entity';
import { HttpException } from '../exceptions/HttpException';
import { Shift } from '../interfaces/shift.interface';
import moment from 'moment';
import { User } from '../interfaces/users.interface';
import UserService from './users.service';
import { UserEntity } from '../entities/users.entity';

@EntityRepository()
class ShiftService extends Repository<ShiftEntity> {
  public userService = new UserService();
  public async findAllShift(): Promise<Shift[]> {
    const shifts: Shift[] = await ShiftEntity.find();
    return shifts;
  }

  public async getById(shiftId: number): Promise<ShiftEntity> {
    if (isEmpty(shiftId)) throw new HttpException(400, 'shiftId is empty');

    const findShift = await ShiftEntity.findOne({ where: { id: shiftId } });
    if (!findShift) throw new HttpException(409, `This shift does not exist`);

    return findShift;
  }

  public async getByUserId(userId: number): Promise<Shift[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'userId is empty');

    const findShifts = await ShiftEntity.find({ where: { userId: userId } });

    return findShifts;
  }

  public async post(shiftData: CreateShiftDto): Promise<Shift> {
    const findShift: ShiftEntity = await ShiftEntity.findOne({
      where: {
        name: shiftData.name,
        shiftDate: Equal(shiftData.shiftDate),
      },
    });
    const user = await this.userService.findUserById(shiftData.userId);
    if (findShift)
      throw new HttpException(409, `This shift "${shiftData.name}" already exists on ${moment(shiftData.shiftDate).format('MMMM Do YYYY')}`);

    const createShiftData = ShiftEntity.create({ ...shiftData });

    createShiftData.user = user as UserEntity;

    return await ShiftEntity.save(createShiftData);
  }

  public async deleteShift(shiftId: number): Promise<Shift> {
    const findShift = await this.getById(shiftId);

    await ShiftEntity.delete({ id: shiftId });
    return findShift;
  }

  public async checkInShift(shiftId: number, user: User): Promise<Shift> {
    const findShift = await this.getById(shiftId);

    if (findShift.userId != user.id) throw new HttpException(400, `This shift does not belong to you`);

    // confirm that the checkin date is the same as the shift date
    if (moment(findShift.shiftDate).format('YYYY-MM-DD') != moment().format('YYYY-MM-DD')) {
      throw new HttpException(400, `You can only check in on the day of your shift`);
    }

    // confirm that the shift has not been completed
    if (findShift.completed || findShift.checkin) {
      throw new HttpException(400, `This shift has already been checked in`);
    }

    findShift.checkin = new Date();
    return await ShiftEntity.save(findShift);
  }

  public async checkOutShift(shiftId: number, user: User): Promise<Shift> {
    const findShift = await this.getById(shiftId);

    if (findShift.userId != user.id) throw new HttpException(400, `This shift does not belong to you`);

    // confirm shift is not completed
    if (findShift.completed) {
      throw new HttpException(400, `This shift has already been checked out`);
    }

    // confirm that shift has been checked in
    if (!findShift.checkin) {
      throw new HttpException(400, `You must check in before you can check out`);
    }

    findShift.checkout = new Date();
    // check if shift was up to 8 hrs and complete it
    if (new Date(findShift.checkout).getTime() - new Date(findShift.checkin).getTime() >= 28800000) {
      findShift.completed = true;
      return await ShiftEntity.save(findShift);
    }
    throw new HttpException(400, `You must work at least 8 hours to complete a shift`);
  }

  public async completeShift(shiftId: number): Promise<Shift> {
    const findShift = await this.getById(shiftId);

    findShift.completed = true;
    await findShift.save();

    return findShift;
  }
}

export default ShiftService;
