import { Request, Response, NextFunction } from 'express';
import { CreateShiftDto } from '../dtos/shift.dto';
import { RequestWithUser } from '../interfaces/auth.interface';
import ShiftService from '../services/shift.service';

export class ShiftController {
  public shiftService = new ShiftService();

  public get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllShiftsData = await this.shiftService.findAllShift();

      res.status(200).json({ data: findAllShiftsData, message: 'successful' });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shiftId = Number(req.params.id);
      const findOneShiftData = await this.shiftService.getById(shiftId);

      res.status(200).json({ data: findOneShiftData, message: 'successful' });
    } catch (error) {
      next(error);
    }
  };

  public getShiftByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.userId);
      const findShiftByUserIdData = await this.shiftService.getByUserId(userId);

      res.status(200).json({ data: findShiftByUserIdData, message: 'successful' });
    } catch (error) {
      next(error);
    }
  };

  public getMyShifts = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.user.id);
      const findShiftByUserIdData = await this.shiftService.getByUserId(userId);

      res.status(200).json({ data: findShiftByUserIdData, message: 'successful' });
    } catch (error) {
      next(error);
    }
  };

  public post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shiftData: CreateShiftDto = req.body;
      const createShiftData = await this.shiftService.post(shiftData);

      res.status(201).json({ data: createShiftData, message: 'successful' });
    } catch (error) {
      next(error);
    }
  };

  public checkIn = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shiftId = Number(req.params.id);
      const checkInData = await this.shiftService.checkInShift(shiftId, req.user);

      res.status(200).json({ data: checkInData, message: 'successful' });
    } catch (error) {
      next(error);
    }
  };

  public checkOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shiftId = Number(req.params.id);
      const checkOutData = await this.shiftService.checkOutShift(shiftId, req.user);

      res.status(200).json({ data: checkOutData, message: 'successful' });
    } catch (error) {
      next(error);
    }
  };
}
