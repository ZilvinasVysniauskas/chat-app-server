import { check } from "express-validator";
import User from "../models/user";

export const validateEmail = check('email')
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject('Email address already exists!');
            }
        });
    })
    .normalizeEmail();

const validateUsername = check('username')
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 4 characters long.')
    .trim();

const validatePassword = check('password')
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

const validatePasswordRepeat = check('passwordRepeat')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match.');
        }
        return true;
    })
    .trim();
