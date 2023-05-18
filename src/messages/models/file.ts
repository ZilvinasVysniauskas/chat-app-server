import mongoose, { Schema, Document } from 'mongoose';
import { ModelSchemaNames } from '../../common/models.const';

export interface IFile extends Document {
  contentType: string
  data: Buffer;
}

const fileSchema: Schema = new Schema({
  contentType: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
});

const File = mongoose.model<IFile>(ModelSchemaNames.FILE, fileSchema);

export default File;