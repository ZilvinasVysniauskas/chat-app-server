import { Request, Response } from 'express';
import * as expressValidator from 'express-validator';
import { createUser, login } from '../../../src/authorization/controllers/auth-controller';
import * as authService from '../../../src/authorization/service/auth-service';
import { IUser } from '../../../src/authorization/models/user';

jest.mock('express-validator', () => {
  return {
    __esModule: true,
    ...jest.requireActual('express-validator'),
  };
});

const mockedUser: Partial<IUser> = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'testpassword',
} as IUser;

const mockedAuthResponse = {
  token: 'mocked-token',
  userId: 'user-id',
  expiresIn: 3600,
}

const req = {
  body: { ...mockedUser },
} as Request;


const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as any;


describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {

    beforeEach(() => {
      jest.spyOn(expressValidator, 'validationResult').mockImplementation((): any => {
        return {
          errors: [],
          isEmpty: () => true,
        };
      });
    });

    it('should create a new user when no errors', async () => {

      jest.spyOn(authService, 'registerUser').mockResolvedValue(mockedAuthResponse);

      await createUser(req, res);

      expect(authService.registerUser).toHaveBeenCalledWith(mockedUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockedAuthResponse);
    });

    it('should return 422 when validation error', async () => {
      jest.spyOn(expressValidator, 'validationResult').mockImplementation((): any => {
        const errors = [{ msg: 'Validation error' }];
        return {
          errors: errors,
          array: () => errors,
          isEmpty: () => false,
        };
      });

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed, entered data is incorrect.',
        errors: [{ msg: 'Validation error' }],
      });
    });

    it('should return 500 when server error', async () => {
      jest.spyOn(authService, 'registerUser').mockRejectedValue(new Error('Server error'));

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      jest.spyOn(expressValidator, 'validationResult').mockImplementation((): any => {
        return {
          errors: [],
          isEmpty: () => true,
        };
      });
    }
  });

});