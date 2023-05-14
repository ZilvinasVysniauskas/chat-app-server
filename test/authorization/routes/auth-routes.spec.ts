import request from 'supertest';
import express from 'express';
import authRoutes from '../../../src/authorization/routes/auth-routes';
import { validateEmail, validatePassword, validatePasswordRepeat, validateUsername } from '../../../src/authorization/middleware/validators';
import * as userController from '../../../src/authorization/controllers/auth-controller';
import { LoginRequest } from '../../../src/authorization/models/user';

jest.mock('../../../src/authorization/controllers/auth-controller', () => ({
  createUser: jest.fn().mockImplementation(async (_req, res) => { res.status(201).json({ message: 'User created' }) }),
  login: jest.fn().mockImplementation(async (_req, res) => { res.status(201).json({ message: 'User logged in' }) }),
}));

jest.mock('../../../src/authorization/middleware/validators', () => ({
  validateEmail: jest.fn().mockImplementation((_req, _res, next) => next()),
  validatePassword: jest.fn().mockImplementation((_req, _res, next) => next()),
  validatePasswordRepeat: jest.fn().mockImplementation((_req, _res, next) => next()),
  validateUsername: jest.fn().mockImplementation((_req, _res, next) => next()),
}));

describe('Auth Routes', () => {

  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {

    it('POST /register should call the middleware functions and controller createUser', (done) => {

      const requestBody = {
        email: 'test10@example.com',
        username: 'testuser',
        password: 'Testpassword123',
        passwordRepeat: 'Testpassword123',
      };

      request(app)
        .post('/auth/register')
        .send(requestBody)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).toBe(201);
          expect(res.body.message).toBe('User created');
          expect(validateEmail).toHaveBeenCalled();
          expect(validatePassword).toHaveBeenCalled();
          expect(validatePasswordRepeat).toHaveBeenCalled();
          expect(validateUsername).toHaveBeenCalled();
          expect(userController.createUser).toHaveBeenCalled();
          done();
        });
    });

    it('POST /register should return 422 when validation fails', (done) => {
      const requestBody = {
        email: 'test10@example.com',
        username: 'testuser',
        password: 'Testpassword123',
        passwordRepeat: 'Testpassword123',
      };

      jest.spyOn(userController, 'createUser').mockImplementation(async (_req, res) => {
        return res.status(422).json({ message: 'Validation failed' });
      });
        request(app)
          .post('/auth/register')
          .send(requestBody)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.status).toBe(422);
            expect(res.body.message).toBe('Validation failed');
            expect(userController.createUser).toHaveBeenCalled();
            done();
          });

    });
  });

  describe('POST /login', () => {
      
      it('POST /login should call the middleware functions and controller login', (done) => {
  
        const loginRequest: LoginRequest = {
          email: 'test10@example.com',
          password: 'Testpassword123',
        };

        request(app)
          .post('/auth/login')
          .send(loginRequest)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User logged in');
            expect(validateEmail).toHaveBeenCalled();
            expect(validatePassword).toHaveBeenCalled();
            expect(userController.login).toHaveBeenCalled();
            done();
          });
      });

      it('POST /login should return 422 when validation fails', (done) => {
        const loginRequest: LoginRequest = {
          email: 'test10@example.com',
          password: 'Testpassword123',
        };

        jest.spyOn(userController, 'login').mockImplementation(async (_req, res) => {
          return res.status(422).json({ message: 'Validation failed' });
        });

        request(app)
          .post('/auth/login')
          .send(loginRequest)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.status).toBe(422);
            expect(res.body.message).toBe('Validation failed');
            expect(userController.login).toHaveBeenCalled();
            done();
          });
        });
    });
});
