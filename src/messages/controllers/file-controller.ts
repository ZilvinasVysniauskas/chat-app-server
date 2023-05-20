import * as fileService from '../services/file-service';
import * as awsService from '../services/aws-service';
import { Request, Response } from 'express';


export const saveFileMetadataAndGetUrl = async (req: Request, res: Response) => {
    try {
        const savedFileInfo = await fileService.saveFileInfo(req.body.fileName, req.body.contentType);
        const url = await awsService.generatePresignedUrl(
            {
                fileName: savedFileInfo._id.toString() + '.' + savedFileInfo.contentType.split('/')[1],
                contentType: savedFileInfo.contentType,
            }
        );
        return res.status(200).json({ url: url, fileId: savedFileInfo._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};