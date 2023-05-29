import mongoose, { Schema, Document } from 'mongoose';
import { ModelSchemaNames } from '../../common/models.const';

export interface IMessage extends Document {
  message: string;
  sender: string;
  timestamp: Date;
  file: string;
}

export interface MessageRequest {
  roomId: string;
  message: string;
  savedFileId?: string;
  sender: string;
  fileKey?: string | null;
}

export interface MessageResponse {
  id: string;
  text: string | null;
  file?: FileData | null;
  createdAt: Date;
  sender: string;
}

export interface FileData {
  fileName: string;
  url: string;
}

const messageSchema: Schema = new Schema({
  message: {
    type: String,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: ModelSchemaNames.USER,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  file: {
    type: Schema.Types.ObjectId,
    ref: ModelSchemaNames.FILE,
  },
});

const Message = mongoose.model<IMessage>(ModelSchemaNames.MESSAGE, messageSchema);

export default Message;
