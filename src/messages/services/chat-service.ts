import e from "express";
import { MessageRequest } from "../models/message";
import { AddUserToRoomRequest, IChatRoom, RoomRequest } from "../models/room";
import * as chatRepository from '../repository/chat-repository';

export const createNewRoom = async (request: RoomRequest): Promise<IChatRoom> => {
    try {
        return await chatRepository.createNewRoom(request);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create room.');
    }
};

export const addUserToRoom = async (request: AddUserToRoomRequest): Promise<IChatRoom> => {
    try {
        const response: IChatRoom | null = await chatRepository.addUserToRoom(request);
        if (!response) {
            throw new Error('Room not found.');
        }
        return response;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add user to room.');
    }
};

export const saveMessage = async (request: MessageRequest): Promise<IChatRoom> => {
    try {
        const message = await chatRepository.saveMessage(request);

        const response: IChatRoom | null = await chatRepository.addMessageToRoom(request.roomId, message._id);

        if (!response) {
            throw new Error('Room not found.');
        }
        
        return response;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add message to room.');
    }
};

export const getRoomById = async (roomId: string): Promise<IChatRoom> => {
    try {
        const response: IChatRoom | null = await chatRepository.getRoomById(roomId);
        if (!response) {
            throw new Error('Room not found.');
        }
        return response;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get room.');
    }
}
