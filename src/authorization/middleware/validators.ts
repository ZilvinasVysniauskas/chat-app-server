import { check } from "express-validator";
import { findUserByEmail } from "../repository/auth-repository";

export const validateEmail = check('email')
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail();

export const emailExists = check('email')
    .custom((value, { req }) => {
        return findUserByEmail(value).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        });
    });

export const validateUsername = check('username')
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 4 characters long.')
    .trim();

export const validatePassword = check('password')
    .notEmpty().withMessage('Password is required.')
    .custom((value, { req }) => {
        if (!/(?=.*[A-Z])/.test(value)) {
            throw new Error('Password must include at least one capital letter.');
        }
        if (!/(?=.*\d)/.test(value)) {
            throw new Error('Password must include at least one digit.');
        }
        return true;
    })
    .trim();

export const validatePasswordRepeat = check('passwordRepeat')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match.');
        }
        return true;
    })
    .trim();
