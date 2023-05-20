import { getFileUrl } from "../services/aws-service";

export const messagesToMessagesResponse = (messages: any) => {
    const promises = messages.map(async (message: any) => {
        const fileUrl = message.file ? await getFileUrl(`${message.file._id}.${message.file.contentType.split('/')[1]}`) : null;
        return {
            message: message.message,
            createdAt: message.createdAt,
            file: fileUrl ? {
                url: fileUrl,
                fileName: message.file.fileName,
            } : null,
        }
    });
    return Promise.all(promises);
}