import moment from 'moment';
import { createConnection, getConnection } from 'typeorm';
import { dbConnection } from '../databases';
import { ShiftEntity } from '../entities/shifts.entity';
import { Role } from '../entities/users.entity';
import { ShiftTime } from '../interfaces/shift.interface';
import { User } from '../interfaces/users.interface';
import ShiftService from '../services/shift.service';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await getConnection().close();
});

describe('Testing Shifts', () => {
  describe('GET shifts', () => {
    it('response findAll shifts', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.find = jest.fn().mockReturnValue([
        {
          id: 1,
          shiftDate: '2021-01-01 00:00:00',
          shiftTime: ShiftTime.MORNING,
          userId: 1,
          checkin: null,
          checkout: null,
          completed: false,
          name: 'test1',
        },
        {
          id: 2,
          shiftDate: '2021-01-01 00:00:00',
          shiftTime: ShiftTime.MORNING,
          userId: 1,
          checkin: null,
          checkout: null,
          completed: false,
          name: 'test2',
        },
        {
          id: 3,
          shiftDate: '2021-01-01 00:00:00',
          shiftTime: ShiftTime.MORNING,
          userId: 1,
          checkin: null,
          checkout: null,
          completed: false,
          name: 'test3',
        },
      ]);

      const response = await shiftService.findAllShift();
      expect(response[0]).toStrictEqual({
        id: 1,
        shiftDate: '2021-01-01 00:00:00',
        shiftTime: ShiftTime.MORNING,
        userId: 1,
        checkin: null,
        checkout: null,
        completed: false,
        name: 'test1',
      });
    });
  });

  describe('GET shifts by id', () => {
    it('response findOne shift', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: '2021-01-01 00:00:00',
        shiftTime: ShiftTime.MORNING,
        userId: 1,
        checkin: null,
        checkout: null,
        completed: false,
        name: 'test1',
      });

      const response = await shiftService.getById(1);
      expect(response.id).toEqual(1);
      expect(response.name).toEqual('test1');
    });

    it('shoult throw an error when id is not found', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue(null);

      try {
        await shiftService.getById(1);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('This shift does not exist');
      }
    });
  });

  describe('POST shifts', () => {
    it('response Create shift', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue(null);
      ShiftEntity.save = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: '2021-01-01',
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        checkin: null,
        checkout: null,
        completed: false,
        name: 'test1',
      });

      const response = await shiftService.post({
        shiftDate: '2021-01-01 00:00:00',
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        name: 'test1',
      });
      expect(response.id).toEqual(1);
      expect(response.name).toEqual('test1');
      expect(response.shiftTime).toEqual(ShiftTime.AFTERNOON);
    });

    it('shoult throw an error when shift already exists on shift date', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: '2024-01-01',
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        checkIn: null,
        checkOut: null,
        completed: false,
        name: 'test1',
      });

      try {
        await shiftService.post({
          shiftDate: '2024-01-01 00:00:00',
          shiftTime: ShiftTime.AFTERNOON,
          userId: 1,
          name: 'test1',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual(`This shift "test1" already exists on ${moment('2024-01-01 00:00:00').format('MMMM Do YYYY')}`);
      }
    });
  });

  describe('Shift checkin', () => {
    it('response checkin shift', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: moment(),
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        checkin: null,
        checkout: null,
        completed: false,
        name: 'test1',
      });
      ShiftEntity.save = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: moment(),
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        checkin: new Date(),
        checkout: null,
        completed: false,
        name: 'test1',
      });

      const user: User = {
        email: 'test@email.com',
        name: 'test user',
        role: Role.WORKER,
        id: 1,
        isActive: true,
      };

      const response = await shiftService.checkInShift(1, user);
      expect(response.id).toEqual(1);
      expect(response.name).toEqual('test1');
      expect(response.checkin).toBeDefined();
    });

    it('should throw an error when shift does not belong to user', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: moment(),
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        user: {
          email: 'test@email.com',
          name: 'test user',
          role: Role.WORKER,
          id: 1,
          isActive: true,
        },
        checkin: null,
        checkout: null,
        completed: false,
        name: 'test1',
      });

      const user: User = {
        email: 'test@email.com',
        name: 'test user2',
        role: Role.WORKER,
        id: 2,
        isActive: true,
      };

      try {
        await shiftService.checkInShift(1, user);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('This shift does not belong to you');
      }
    });

    it('should throw an error when shift is already checked in', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: moment(),
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        user: {
          email: 'test@email.com',
          name: 'test user',
          role: Role.WORKER,
          id: 1,
          isActive: true,
        },
        checkin: '2021-01-01 00:00:00',
        checkout: '2021-01-01 08:00:00',
        completed: true,
        name: 'test1',
      });

      const user: User = {
        email: 'test@email.com',
        name: 'test user',
        role: Role.WORKER,
        id: 1,
        isActive: true,
      };

      try {
        await shiftService.checkInShift(1, user);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('This shift has already been checked in');
      }
    });

    it('should throw error if checking in on wrong shift date', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: moment().add(1, 'days'),
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        user: {
          email: 'test@email.com',
          name: 'test user',
          role: Role.WORKER,
          id: 1,
          isActive: true,
        },
        checkin: null,
        checkout: null,
        completed: false,
        name: 'test1',
      });

      const user: User = {
        email: 'test@email.com',
        name: 'test user',
        role: Role.WORKER,
        id: 1,
        isActive: true,
      };

      try {
        await shiftService.checkInShift(1, user);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('You can only check in on the day of your shift');
      }
    });
  });

  describe('Shift checkout', () => {
    it('response checkout shift', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: moment(),
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        user: {
          email: 'test@email.com',
          name: 'test user',
          role: Role.WORKER,
          id: 1,
          isActive: true,
        },
        checkin: '2021-01-01 00:00:00',
        checkout: null,
        completed: false,
        name: 'test1',
      });

      const user: User = {
        email: 'test@email.com',
        name: 'test user',
        role: Role.WORKER,
        id: 1,
        isActive: true,
      };

      const response = await shiftService.checkOutShift(1, user);
      expect(response.id).toEqual(1);
      expect(response.name).toEqual('test1');
      expect(response.checkout).toBeDefined();
    });

    it('should throw an error when shift is not checked in', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: moment(),
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        checkin: null,
        checkout: null,
        completed: false,
        name: 'test1',
      });

      const user: User = {
        email: 'test@email.com',
        name: 'test user',
        role: Role.WORKER,
        id: 1,
        isActive: true,
      };

      try {
        await shiftService.checkOutShift(1, user);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('You must check in before you can check out');
      }
    });

    it('should throw an error when shift is already checked out', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: moment(),
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        checkin: '2021-01-01 00:00:00',
        checkout: '2021-01-01 08:00:00',
        completed: true,
        name: 'test1',
      });

      const user: User = {
        email: 'test@email.com',
        name: 'test user',
        role: Role.WORKER,
        id: 1,
        isActive: true,
      };

      try {
        await shiftService.checkOutShift(1, user);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('This shift has already been checked out');
      }
    });

    it('should throw error if shift not up to 8 hours', async () => {
      const shiftService = new ShiftService();

      ShiftEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        shiftDate: moment(),
        shiftTime: ShiftTime.AFTERNOON,
        userId: 1,
        // this test will not pass anymore by 2024
        checkin: '2024-01-01 00:00:00',
        checkout: null,
        completed: false,
        name: 'test1',
      });

      const user: User = {
        email: 'test@email.com',
        name: 'test user',
        role: Role.WORKER,
        id: 1,
        isActive: true,
      };

      try {
        await shiftService.checkOutShift(1, user);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('You must work at least 8 hours to complete a shift');
      }
    });
  });
});
