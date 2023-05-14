import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { registerUser } from '../service/auth-service';


export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed, entered data is incorrect.', errors: errors.array() });
  }

  const { email, username, password } = req.body;

  try {
    const authResponse = await registerUser(email, username, password);
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
