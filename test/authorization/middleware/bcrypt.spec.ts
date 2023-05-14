import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import { bcryptHash } from '../../../src/authorization/middleware/bcrypt';

jest.mock('bcryptjs', () => {
    return {
        __esModule: true,
        ...jest.requireActual('bcryptjs'),
    };
});

const mockedRequest = {
  body: {
    password: 'testpassword',
  },
} as Request;

const mockedResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

const mockedNext = jest.fn() as NextFunction;

describe('bcryptHash Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hash the password and call next', async () => {
    const hashedPassword = 'hashedpassword';

    jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPassword)

    await bcryptHash(mockedRequest, mockedResponse, mockedNext);

    expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 12);
    expect(mockedRequest.body.password).toBe(hashedPassword);
    expect(mockedNext).toHaveBeenCalled();
    expect(mockedResponse.status).not.toHaveBeenCalled();
    expect(mockedResponse.json).not.toHaveBeenCalled();
  });

  it('should return 500 if an error occurs', async () => {
    const errorMessage = 'Error hashing password';

    jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        throw new Error(errorMessage);
    });

    await bcryptHash(mockedRequest, mockedResponse, mockedNext);

    expect(bcrypt.hash).toHaveBeenCalledWith(mockedRequest.body.password, 12);
    expect(mockedNext).not.toHaveBeenCalled();
    expect(mockedResponse.status).toHaveBeenCalledWith(500);
    expect(mockedResponse.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});
