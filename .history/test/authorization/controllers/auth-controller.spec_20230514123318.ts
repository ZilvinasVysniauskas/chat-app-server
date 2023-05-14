import * as userRepository from '../../../src/authorization/repository/auth-repository';
import { createUser, login } from '../../../src/authorization/controllers/auth-controller';
import * as expressValidator from 'express-validator';
import { error } from 'console';

//todo better solution for this
jest.mock('express-validator', () => {
  return {
    __esModule: true,    //    <----- this __esModule: true is important
    ...jest.requireActual('express-validator')
  };
});

jest.mock('../../../src/authorization/repository/auth-repository', () => ({
  register: jest.fn().mockResolvedValue(
    {
      _id: 'user-id',
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpassword',
    }
  ),
  findUserByEmail: jest.fn().mockResolvedValue(
    {
      _id: 'user-id',
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpassword',
    }
  ),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked-token'),
}));

const req = {
  body: {
    email: 'test@example.com',
    username: 'testuser',
    password: 'testpassword',
  },
} as any;

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
        }
      });
    });

    it('should create a new user when no errors', async () => {

      await createUser(req, res);

      expect(userRepository.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpassword',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mocked-token',
        userId: 'user-id',
        expiresIn: 3600,
      });
    });

    it('should return 422 when validation error', async () => {
      jest.spyOn(expressValidator, 'validationResult').mockImplementation((): any => {
        const errors = [{ msg: 'Validation error' }];
        return {
          errors: errors,
          array: () => errors,
          isEmpty: () => false,
        }
      });

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed, entered data is incorrect.',
        errors: [{ msg: 'Validation error' }],
      });
    });

    it('should return 500 when server error', async () => {
      jest.spyOn(userRepository, 'register').mockRejectedValue(new Error('Server error'));

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

      it('should login a user when no errors', async () => {
          
          await login(req, res);
  
          expect(userRepository.findUserByEmail).toHaveBeenCalledWith('
      });
    });



  })

