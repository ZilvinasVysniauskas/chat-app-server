import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AddUserToRoomRequest, RoomRequest } from '../models/room';
import * as chatService from '../services/chat-service';
import * as awsService from '../services/aws-service'

export const createRoom = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed, entered data is incorrect.', errors: errors.array() });
    }

    const roomRequest: RoomRequest = {
        name: req.body.name,
        description: req.body.description,
        participants: req.body.participants,
    };

    try {
        const room = await chatService.createNewRoom(roomRequest);
        return res.status(201).json(room);
    } catch (error) {

    }
};

export const addUserToRoom = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed, entered data is incorrect.', errors: errors.array() });
    }

    const addUserToRoomRequest: AddUserToRoomRequest = {
        roomId: req.params.roomId,
        userId: req.body.userId,
    }

    try {
        const room = await chatService.addUserToRoom(addUserToRoomRequest);
        return res.status(200).json(room);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getRoom = async (req: Request, res: Response) => {
    try {
        const room = await chatService.getRoomById(req.params.roomId);
        return res.status(200).json(room);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const getAwsUrl = async (req: Request, res: Response) => {
    try {
        const url = await awsService.generatePresignedUrl(
            {
                fileName: req.query.fileName as string,
                contentType: req.query.contentType as string,
            }
        );
        console.log(url);
        return res.status(200).json({ url });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getAwsUrl2 = async (req: Request, res: Response) => {
    try {
        const url = await awsService.getFileUrl(

            req.query.fileName as string,

        );
        console.log(url);
        return res.status(200).json({ url });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}