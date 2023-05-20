
import { IFile } from '../models/file';
import * as fileRepository from '../repository/file-repository';

export const saveFileInfo = async (fileName: string, contentType: string): Promise<IFile> => {
    try {
        return await fileRepository.saveFileInfo(fileName, contentType);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to save file.');
    }
}