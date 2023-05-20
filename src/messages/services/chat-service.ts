import { messagesToMessagesResponse } from "../mappers/message-mapper";
import { MessageRequest } from "../models/message";
import { AddUserToRoomRequest, IChatRoom, RoomRequest } from "../models/room";
import * as roomRepository from '../repository/room-repository';

export const createNewRoom = async (request: RoomRequest): Promise<IChatRoom> => {
    try {
        return await roomRepository.createNewRoom(request);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create room.');
    }
};

export const addUserToRoom = async (request: AddUserToRoomRequest): Promise<IChatRoom> => {
    try {
        const response: IChatRoom | null = await roomRepository.addUserToRoom(request);
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
        const message = await roomRepository.saveMessage(request);

        const response: IChatRoom | null = await roomRepository.addMessageToRoom(request.roomId, message._id);

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
        const response: IChatRoom | null = await roomRepository.getRoomById(roomId);
        if (!response) {
            throw new Error('Room not found.');
        }
        return response;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get room.');
    }
}

export const getMessagesByRoomId = async (roomId: string, limit: number, offset: number): Promise<any> => {
    try {
        const room = await roomRepository.getRoomWithMessagesById(roomId, limit, offset);
        if (!room) {
            throw new Error('Room not found.');
        }
        return messagesToMessagesResponse(room.messages);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get messages.');
    }
}