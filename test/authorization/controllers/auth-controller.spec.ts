import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepository from '../../../src/authorization/repository/auth-repository';
import { createUser, login } from '../../../src/authorization/controllers/auth-controller';

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
    it('should create a new user', async () => {
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

  });

});