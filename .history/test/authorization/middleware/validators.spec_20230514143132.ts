import { validationResult } from 'express-validator';
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validatePasswordRepeat,
} from '../path/to/your/validation-file';

jest.mock('express-validator', () => {
  return {
    validationResult: jest.fn(),
    __esModule: true,
    default: jest.fn(),
  };
});

describe('Validation Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateEmail', () => {
    it('should pass validation for a valid email', () => {
      const req = {
        body: {
          email: 'test@example.com',
        },
      };

      validationResult.mockReturnValueOnce({
        errors: [],
        isEmpty: jest.fn().mockReturnValue(true),
      });

      const next = jest.fn();

      validateEmail(req, {}, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation for an empty email', () => {
      const req = {
        body: {
          email: '',
        },
      };

      validationResult.mockReturnValueOnce({
        errors: [{ msg: 'Email is required.' }],
        isEmpty: jest.fn().mockReturnValue(false),
      });

      const next = jest.fn();

      validateEmail(req, {}, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(next).toHaveBeenCalledWith({
        message: 'Email is required.',
      });
    });

    it('should fail validation for an invalid email format', () => {
      const req = {
        body: {
          email: 'invalid-email',
        },
      };

      validationResult.mockReturnValueOnce({
        errors: [{ msg: 'Please enter a valid email.' }],
        isEmpty: jest.fn().mockReturnValue(false),
      });

      const next = jest.fn();

      validateEmail(req, {}, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(next).toHaveBeenCalledWith({
        message: 'Please enter a valid email.',
      });
    });

    it('should fail validation for an existing email', async () => {
      const req = {
        body: {
          email: 'test@example.com',
        },
      };

      validationResult.mockReturnValueOnce({
        errors: [{ msg: 'Email address already exists!' }],
        isEmpty: jest.fn().mockReturnValue(false),
      });

      User.findOne = jest.fn().mockReturnValueOnce(Promise.resolve({}));

      const next = jest.fn();

      await validateEmail(req, {}, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(next).toHaveBeenCalledWith({
        message: 'Email address already exists!',
      });
    });
  });
});