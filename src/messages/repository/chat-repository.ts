import e from "express";
import ChatRoom, { AddUserToRoomRequest, IChatRoom, RoomRequest } from "../models/room";
import Message, { IMessage, MessageRequest } from "../models/message";
import File, { IFile } from '../models/file';


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
    return ChatRoom.findById(roomId).populate('messages');
}

export const saveMessage = async (request: MessageRequest): Promise<IMessage> => {
    return Message.create(request);
}

export const saveFile = async (content: Buffer, contentType: string): Promise<string> => {
  const file = new File({ contentType, data: content });
  const savedFile = await file.save();
  return savedFile._id;
};

export const getFileById = async (fileId: string): Promise<IFile | null> => {
  return File.findById(fileId);
};