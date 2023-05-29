import { IMessage, MessageResponse } from "../models/message";
import { getFileUrl } from "../services/aws-service";

export const messagesToMessagesResponse = (messages: any): Promise<MessageResponse[]> => {
    const promises = messages.map(async (message: any) => {
        const fileUrl = message.file ? await getFileUrl(`${message.file._id}.${message.file.contentType.split('/')[1]}`) : null;
        return {
            id: message._id,
            text: message.message,
            createdAt: message.createdAt,
            file: fileUrl ? {
                url: fileUrl,
                fileName: message.file.fileName,
            } : null,
            sender: message.sender,
        }
    });
    return Promise.all(promises);
}