import { IUser } from '../../../src/authorization/models/user';
import * as userRepository from '../../../src/authorization/repository/auth-repository';
import { registerUser, loginUser } from '../../../src/authorization/service/auth-service';
import * as jwt from 'jsonwebtoken';

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

      jest.spyOn(userRepository, 'register').mockResolvedValue(registeredUser as any);
      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token' as any)

      const authResponse = await registerUser(userToRegister);

      expect(userRepository.register).toHaveBeenCalledWith(userToRegister);
        expect(jwt.sign).toHaveBeenCalledWith({
            email: registeredUser.email,
            userId: registeredUser._id,
        }, 'secret', {)

      expect(authResponse.userId).toBe('user-id');
      expect(authResponse.expiresIn).toBe(3600);
      expect(authResponse.token).toBeDefined();
    });

    // it('should throw an error if registration fails', async () => {
    //   const userToRegister = {
    //     email: 'test@example.com',
    //     username: 'testuser',
    //     password: 'testpassword',
    //   };

    //   const errorMessage = 'Failed to register user.';
    //   userRepository.register.mockRejectedValue(new Error(errorMessage));

    //   await expect(registerUser(userToRegister)).rejects.toThrow(errorMessage);
    // });
  });

//    
});
``
