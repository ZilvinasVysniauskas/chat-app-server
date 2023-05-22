
import { FileRequest, IFile } from '../models/file';
import * as fileRepository from '../repository/file-repository';

export const saveFileInfo = async (fileRequest: FileRequest): Promise<IFile> => {
    try {
        return await fileRepository.saveFileInfo(fileRequest);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to save file.');
    }
}