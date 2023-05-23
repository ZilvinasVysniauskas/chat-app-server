import Joi from "joi";
import { findUserByEmail } from "../repository/auth-repository";

export const registrationSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .external(async (value) => {
            const user = await findUserByEmail(value);
            if (user) {
                throw new Error('E-mail already in use');
            }
        }),
    username: Joi.string()
        .min(4)
        .required(),
    password: Joi.string()
        .required()
        .pattern(new RegExp('(?=.*[A-Z])'))
        .message('Password must include at least one capital letter.')
        .pattern(new RegExp('(?=.*\\d)'))
        .message('Password must include at least one digit.'),
    passwordRepeat: Joi.ref('password'),
}).with('password', 'passwordRepeat');


export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .required(),
});
