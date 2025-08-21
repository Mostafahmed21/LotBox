import joi from 'joi';
import { generalFields } from '../../middlewares/validation.middleware.js';

export const updateProfileSchema = joi
    .object()
    .keys({
        gender: generalFields.gender,
        DOB: generalFields.DOB,
        address: generalFields.address,
        phone: generalFields.phone,
    })
    .required();

export const updatePasswordSchema = joi
    .object()
    .keys({
        oldPassword: generalFields.password,
        password: generalFields.password,
        cPassword: generalFields.cPassword,
    })
    .required();
