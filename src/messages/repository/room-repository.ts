import ChatRoom, { AddUserToRoomRequest, IChatRoom, RoomRequest } from "../models/chat-room";
import Message, { IMessage, MessageRequest } from "../models/message";
import { Types } from 'mongoose';

export const createNewRoom = async (room: RoomRequest): Promise<IChatRoom> => {
    return new ChatRoom(room).save();
}

export const addUserToRoom = async (request: AddUserToRoomRequest): Promise<IChatRoom | null> => {
    return ChatRoom.findByIdAndUpdate(request.roomId, { $push: { participants: request.roomId } }, { new: true });
}

export const addMessageToRoom = async (roomId: string, messageId: string): Promise<IChatRoom | null> => {
    return ChatRoom.findByIdAndUpdate(roomId, { $push: { messages: messageId } }, { new: true });
}

export const getRoomById = async (roomId: string): Promise<IChatRoom | null> => {
    return ChatRoom.findById(roomId).select('-messages');
}

export const saveMessage = async (request: MessageRequest): Promise<IMessage> => {
    const optionalFile = request.savedFileId ? new Types.ObjectId(request.savedFileId) : null;
    return Message.create({
        message: request.message,
        sender: request.sender,
        file: optionalFile
    });
}

export const getRoomWithMessagesById = async (roomId: string, limit: number, offset: number): Promise<IChatRoom | null> => {
    return ChatRoom.findById(roomId).select('par').populate({
        path: 'messages',
        options: {
          skip: offset,
          limit: limit,
          sort: { 'timestamp': -1 }
        },
        populate: {
          path: 'file',
        },
      });
};