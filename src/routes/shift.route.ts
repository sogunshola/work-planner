import { Router } from 'express';
import { ShiftController } from '../controllers/shift.controller';
import { CreateShiftDto } from '../dtos/shift.dto';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';

class ShiftRoute implements Routes {
  public path = '/shifts';
  public router = Router();
  public shiftController = new ShiftController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.shiftController.get);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.shiftController.getById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateShiftDto, 'body'), this.shiftController.post);
    this.router.get(`${this.path}/user/:userId(\\d+)`, authMiddleware, this.shiftController.getShiftByUserId);
    this.router.get(`${this.path}/myShifts`, authMiddleware, this.shiftController.getMyShifts);
    this.router.post(`${this.path}/:id/checkIn`, authMiddleware, this.shiftController.checkIn);
    this.router.post(`${this.path}/:id/checkOut`, authMiddleware, this.shiftController.checkOut);
  }
}

export default ShiftRoute;
