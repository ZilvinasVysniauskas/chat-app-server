import mongoose, { Schema, Document } from 'mongoose';
import { ModelSchemaNames } from '../../common/models.const';

export interface IMessage extends Document {
  content: string;
  sender: string;
  timestamp: Date;
  room: string;
}

export interface MessageRequest {
  roomId: string;
  type: string;
  content: any;
  sender: string;
}

const messageSchema: Schema = new Schema({
  content: {
    type: String,
    required: true
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
