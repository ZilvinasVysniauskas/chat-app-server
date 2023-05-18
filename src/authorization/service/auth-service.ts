import * as userRepository from '../repository/auth-repository';
import { sign } from 'jsonwebtoken';
import { AuthResponse, IUser, LoginRequest, RegisterRequest } from '../models/user';
import { compare } from 'bcryptjs';

const jwtSecret = process.env.JWT_SECRET || 'somesupersecretsecret';

export const registerUser = async (RegisterRequest: RegisterRequest) => {
  try {
    const user = await userRepository.register(RegisterRequest);
    return generateAuthResponse(user.email, user._id);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to register user.');
  }
};

export const loginUser = async (loginRequest: LoginRequest) => {
  try {
    const user = await userRepository.findUserByEmail(loginRequest.email);

    if (!user) {
      throw new Error('A user with this email could not be found.');
    }

    const isEqual = await compare(loginRequest.password, user.password);

    if (!isEqual) {
      throw new Error('Wrong password!');
    }

    return generateAuthResponse(user.email, user._id);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to login user.');
  }
};

function generateAuthResponse(email: string, userId: string): AuthResponse {
  try {
    const expiresIn = 3600 * 10000;
    const token = sign(
      {
        email,
        userId,
      },
      jwtSecret,
      { expiresIn }
    );
    return { token, userId, expiresIn };
  } catch (error) {
    throw new Error('Failed to generate authentication token.');
  }
}