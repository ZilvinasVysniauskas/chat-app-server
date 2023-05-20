import { NextFunction } from "express";
import { Request, Response } from "express-serve-static-core";

export const validateGetRoomRequest = (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.limit) {
        return res.status(422).json({ message: 'Limit is required.' });
    }
    if (!req.query.offset) {
        return res.status(422).json({ message: 'Offset is required.' });
    }
};