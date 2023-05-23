import { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';

export const validateRequestBody = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(422).json(handleJoiError(error));
        }
        next();
    };
};

export const validateRequestBodyAsync = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error: any) {
            return res.status(422).json(handleJoiError(error));
        }
    };
}

export const validateRequestQuery = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.query, { abortEarly: false });
        if (error) {
            return res.status(422).json(handleJoiError(error));
        }
        next();
    };
}

function handleJoiError(error: any) {
    return { message: 'validation failed', errors: error.details.map((detail: any) => detail.message) }
}