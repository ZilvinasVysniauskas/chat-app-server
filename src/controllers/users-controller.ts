import * as userService from '../service/users-service';
import { Request, Response } from 'express';

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);

    //todo figure out validations
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  getUserById,
  createUser,
};