import { hash } from "bcryptjs";
import { NextFunction } from "express";
import { Request, Response } from 'express';


export const bcryptHash = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password } = req.body;
      const hashedPassword = await hash(password, 12);
      req.body.password = hashedPassword;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  