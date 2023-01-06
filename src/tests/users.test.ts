import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '../app';
import { dbConnection } from '../databases';
import { UpdateUserDto } from '../dtos/users.dto';
import { UserEntity, Role } from '../entities/users.entity';
import { User } from '../interfaces/users.interface';
import UserRoute from '../routes/users.route';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await getConnection().close();
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response findAll users', async () => {
      const usersRoute = new UserRoute();

      UserEntity.find = jest.fn().mockReturnValue([
        {
          id: 1,
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          id: 2,
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          id: 3,
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      const app = new App([usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}`).expect(200);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response findOne user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response Update user', async () => {
      const userId = 1;
      const userData: UpdateUserDto = {
        name: 'test user',
        role: Role.WORKER,
      };

      const usersRoute = new UserRoute();

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: 'test@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      } as User);
      UserEntity.update = jest.fn().mockReturnValue({
        generatedMaps: [],
        raw: [],
        affected: 1,
      });
      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: 'test@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response Delete user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      UserEntity.delete = jest.fn().mockReturnValue({
        id: userId,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(200);
    });
  });
});
