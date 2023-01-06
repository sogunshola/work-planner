import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '../app';
import { dbConnection } from '../databases';
import { CreateUserDto, LoginDto } from '../dtos/users.dto';
import { UserEntity, Role } from '../entities/users.entity';
import AuthRoute from '../routes/auth.route';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await getConnection().close();
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
        name: 'test user',
        role: Role.WORKER,
      };

      const authRoute = new AuthRoute();

      UserEntity.findOne = jest.fn().mockReturnValue(null);
      UserEntity.save = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        name: 'test user',
        role: Role.WORKER,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}signup`).send(userData).expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: LoginDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      const authRoute = new AuthRoute();

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        name: 'test user',
        role: Role.WORKER,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });
});
