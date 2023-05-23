import mongoose, { Schema, Document, Model } from 'mongoose';
import { ModelSchemaNames } from '../../common/models.const';
import { IMessage } from './message';

export interface IChatRoom extends Document {
  name: string;
  description: string;
  participants: string[];
  messages: IMessage[];
}

export interface RoomRequest {
  name: string;
  description: string;
  participants: string[];
}

export interface AddUserToRoomRequest {
  roomId: string;
  userId: string;
}

const chatRoomSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: ModelSchemaNames.USER,
    required: true
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: ModelSchemaNames.MESSAGE,
  }]
});

const ChatRoom = mongoose.model<IChatRoom>(ModelSchemaNames.CHAT_ROOM, chatRoomSchema);

export default ChatRoom;
