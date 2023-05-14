import { AuthResponse, IUser } from '../models/user';
import { Request, Response } from 'express';
import * as userRepository from '../repository/auth-repository'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const jwtSecret = process.env.JWT_SECRET || 'somesupersecretsecret';

export const createUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ message: 'Validation failed, entered data is incorrect.', errors: errors.array() });
    }

    const { email, username, password } = req.body;

    try {
      const user: IUser = await userRepository.register({ email, username, password });
      return res.status(201).json(generateAuthResponse(user.email, user._id));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed, entered data is incorrect.', errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user: IUser | null = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('A user with this email could not be found.');
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new Error('Wrong password!');
    }

    res.status(200).json(generateAuthResponse(user.email, user._id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const test = async (req: Request, res: Response): Promise<IUser | null> => {
  const r: IUser | null = await userRepository.findUserByEmail('test');
  return r;
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