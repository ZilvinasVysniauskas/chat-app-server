import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { loginUser, registerUser } from '../service/auth-service';
import { IUser, LoginRequest, RegisterRequest } from '../models/user';
import Joi from 'joi';



export const createUser = async (req: Request, res: Response) => {
  try {
    const authResponse = await registerUser({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    return res.status(201).json(authResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const authResponse = await loginUser({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json(authResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};