import joi from 'joi';
import { generalFields } from '../../middlewares/validation.middleware.js';

export const signUpSchema = joi
    .object()
    .keys({
        name: generalFields.name.required(),
        email: generalFields.email.required(),
        password: generalFields.password.required(),
        cPassword: generalFields.cPassword.required(),
    })
    .required();

export const confirmEmailSchema = joi
    .object()
    .keys({
        code: generalFields.code.required(),
        email: generalFields.email.required(),
    })
    .required();

export const loginSchema = joi
    .object()
    .keys({
        password: generalFields.password.required(),
        email: generalFields.email.required(),
    })
    .required();

export const forgotPasswordSchema = joi
    .object()
    .keys({
        email: generalFields.email.required(),
    })
    .required();

export const resetPasswordSchema = joi
    .object()
    .keys({
        code: generalFields.code.required(),
        password: generalFields.password.required(),
        cPassword: generalFields.cPassword.required(),
    })
    .required();
