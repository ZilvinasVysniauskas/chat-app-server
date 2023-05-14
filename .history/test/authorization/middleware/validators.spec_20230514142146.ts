import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import {
  validateRegistrationRequest,
  validateLoginRequest,
} from '../middleware/validation';

describe('Validation Middleware', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {},
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateRegistrationRequest', () => {
    it('should pass validation for a valid registration request', async () => {
      req.body = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test1234',
        passwordRepeat: 'Test1234',
      };

      await validateRegistrationRequest(req, res, jest.fn());

      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return validation errors for an invalid registration request', async () => {
      req.body = {
        email: 'invalid-email',
        username: 'ab',
        password: 'weakpassword',
        passwordRepeat: 'passwordMismatch',
      };

      await validateRegistrationRequest(req, res, jest.fn());

      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed, entered data is incorrect.',
        errors: errors.array(),
      });
    });
  });

  describe('validateLoginRequest', () => {
    it('should pass validation for a valid login request', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'Test1234',
      };

      await validateLoginRequest(req, res, jest.fn());

      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return validation errors for an invalid login request', async () => {
      req.body = {
        email: 'invalid-email',
        password: '',
      };

      await validateLoginRequest(req, res, jest.fn());

      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed, entered data is incorrect.',
        errors: errors.array(),
      });
    });
  });
});
