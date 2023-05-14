import * as userRepository from '../repository/auth-repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'somesupersecretsecret';

export const registerUser = async (email: string, username: string, password: string) => {
  try {
    const user = await userRepository.register({ email, username, password });
    return generateAuthResponse(user.email, user._id);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to register user.');
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('A user with this email could not be found.');
    }

    const isEqual = await bcrypt.compare(password, user.password);

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
    const expiresIn = 3600;
    const token = jwt.sign(
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