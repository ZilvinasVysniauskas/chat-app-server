import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { loginUser, registerUser } from '../service/auth-service';
import { IUser } from '../models/user';


export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed, entered data is incorrect.', errors: errors.array() });
  }

  const user: Partial<IUser> = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  }

  try {
    const authResponse = await registerUser(user);
    return res.status(201).json(authResponse);
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
    const authResponse = await loginUser(email, password);
    res.status(200).json(authResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
