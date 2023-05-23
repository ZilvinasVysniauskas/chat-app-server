import mongoose, { Schema, Document } from 'mongoose';
import { ModelSchemaNames } from '../../common/models.const';

export interface IFile extends Document {
  contentType: string
  data: Buffer;
}

export interface FileRequest {
  contentType: string;
  fileName: string;
}

const fileSchema: Schema = new Schema({
  contentType: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

const File = mongoose.model<IFile>(ModelSchemaNames.FILE, fileSchema);

export default File;