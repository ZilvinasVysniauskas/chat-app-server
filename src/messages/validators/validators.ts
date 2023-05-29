import Joi from "joi";

export const getMessagesSchema = Joi.object({
    limit: Joi.number()
        .min(1)
        .max(100)
        .required(),
    offset: Joi.number()
        .min(0)
        .required()
});

export const createRoomSchema = Joi.object({
    name: Joi.string()
        .min(4)
        .required(),
    description: Joi.string()
        .min(4)
        .required(),
    participants: Joi.array()
});

export const addUserToRoomSchema = Joi.object({
    userId: Joi.string()
        .required()
});

export const messageRequestSchema = Joi.object({
    roomId: Joi.string().required(),
    message: Joi.string().min(1).allow(null).allow('').when('savedFileId', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
    }),
    savedFileId: Joi.string().min(1),
    sender: Joi.string().required(),
    fileKey: Joi.string()
        .min(1)
        .when('savedFileId', {
            is: Joi.exist(),
            then: Joi.required(),
        })
});