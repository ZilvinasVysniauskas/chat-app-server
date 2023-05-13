import User, { AuthResponse, IUser, RegisterRequest } from '../models/user';
import e, { Request, Response } from 'express';
import * as userRepository from '../repository/auth-repository'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response) => {

    const email = req.body.email;
    const name = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, 12).then((hashedPassword: string) => {
      const user: Partial<IUser> = {
        email: email,
        username: name,
        password: hashedPassword,
      }
      return userRepository.register(user);
    }).then((user: IUser) => {
      res.status(201).json(generateAuthResponse(user.email, user._id));
    }).catch((error: Error) => {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    });
};

export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser: IUser;
  User.findOne({ email: email }).then((user: IUser | null) => {
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      throw error;
    }
    loadedUser = user;
    return bcrypt.compare(password, user.password);
  }).then((isEqual: boolean) => {
    if (!isEqual) {
      const error = new Error('Wrong password!');
      throw error;
    }
    res.status(200).json(generateAuthResponse(loadedUser.email, loadedUser._id));
  }).catch((error: Error) => {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  });
};

function generateAuthResponse(email: string, userId: string): AuthResponse {
  const expiresIn = 3600;
  const token = jwt.sign(
    {
      email: email,
      userId: userId,
    },
    'secret',
    { expiresIn: expiresIn }
  );
  return { token: token, userId: userId, expiresIn: expiresIn };
};