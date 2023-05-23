import File, { FileRequest, IFile } from '../models/file';

export const saveFileInfo = async (fileRequest: FileRequest): Promise<IFile> => {
    return new File(fileRequest).save();
  };