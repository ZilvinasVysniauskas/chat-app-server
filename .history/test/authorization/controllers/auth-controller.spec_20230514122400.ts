import * as userRepository from '../../../src/authorization/repository/auth-repository';
import { createUser } from '../../../src/authorization/controllers/auth-controller';
import * as expressValidator from 'express-validator';

//todo better solution for this
jest.mock('express-validator', () => {
  return {
    __esModule: true,    //    <----- this __esModule: true is important
    ...jest.requireActual('express-validator')
  };
});

jest.spyOn(expressValidator, 'validationResult').mockImplementation((): any => {
  return {
    errors: [],
    isEmpty: () => true,
  }
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
          errors: e,
          array: () => [{ msg: 'Validation error' }],
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

  });


})

