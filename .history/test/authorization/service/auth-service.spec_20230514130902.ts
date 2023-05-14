import * as userRepository from '../repository/auth-repository';
import { registerUser, loginUser } from '../service/auth-service';

jest.mock('../repository/auth-repository', () => {
  return {
    register: jest.fn(),
    findUserByEmail: jest.fn(),
  };
});

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user and generate auth response', async () => {
      const userToRegister = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpassword',
      };

      const registeredUser = {
        email: 'test@example.com',
        _id: 'user-id',
      };

      userRepository.register.mockResolvedValue(registeredUser);

      const authResponse = await registerUser(userToRegister);

      expect(userRepository.register).toHaveBeenCalledWith(userToRegister);
      expect(authResponse.email).toBe('test@example.com');
      expect(authResponse.userId).toBe('user-id');
      expect(authResponse.expiresIn).toBe(3600);
      expect(authResponse.token).toBeDefined();
    });

    it('should throw an error if registration fails', async () => {
      const userToRegister = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpassword',
      };

      const errorMessage = 'Failed to register user.';
      userRepository.register.mockRejectedValue(new Error(errorMessage));

      await expect(registerUser(userToRegister)).rejects.toThrow(errorMessage);
    });
  });

  describe('loginUser', () => {
    it('should login a user and generate auth response', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      const foundUser = {
        email: 'test@example.com',
        _id: 'user-id',
        password: 'hashedPassword',
      };

      userRepository.findUserByEmail.mockResolvedValue(foundUser);
      userRepository.comparePassword.mockResolvedValue(true);

      const authResponse = await loginUser(email, password);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.comparePassword).toHaveBeenCalledWith(password, foundUser.password);
      expect(authResponse.email).toBe('test@example.com');
      expect(authResponse.userId).toBe('user-id');
      expect(authResponse.expiresIn).toBe(3600);
      expect(authResponse.token).toBeDefined();
    });

    it('should throw an error if user login fails', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      const errorMessage = 'Failed to login user.';
      userRepository.findUserByEmail.mockRejectedValue(new Error(errorMessage));

      await expect(loginUser(email, password)).rejects.toThrow(errorMessage);
    });

    it('should throw an error if user with given email not found', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      const errorMessage = 'A user with this email could not be found.';
      userRepository.findUserByEmail.mockResolvedValue(null);

      await expect(loginUser(email, password)).rejects.toThrow(errorMessage);
    });

    it('should throw an error if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      const foundUser = {
        email: 'test@example.com',
        _id: 'user-id',
        password: 'hashedPassword',
      };

      userRepository.findUserByEmail.mockResolvedValue(foundUser);
      userRepository.comparePassword.mockResolvedValue(false);

      await expect(loginUser(email, password)).rejects.toThrow('Wrong password!');
    });
  });
});
``
