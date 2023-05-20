import File, { IFile } from '../models/file';

export const saveFileInfo = async (fileName: string, contentType: string): Promise<IFile> => {
    return new File({ contentType: contentType, fileName: fileName }).save();
  };