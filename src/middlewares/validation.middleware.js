import joi from 'joi';
import { Types } from 'mongoose';
import { genderTypes } from '../DB/models/user.model.js';

export const isValidObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid id');
};

const fileObj = {
    fieldname: joi.string().valid('attachment'),
    originalname: joi.string(),
    encoding: joi.string(),
    mimetype: joi.string(),
    finalPath: joi.string(),
    destination: joi.string(),
    filename: joi.string(),
    path: joi.string(),
    size: joi.number(),
};
export const generalFields = {
    name: joi.string().min(3).max(50),
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 3,
        tlds: { allow: ['com', 'net'] },
    }),
    password: joi
        .string()
        .pattern(
            new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        ),
    cPassword: joi.string().valid(joi.ref('password')),
    code: joi.string().pattern(new RegExp(/^\d{5}$/)),
    id: joi.string().custom(isValidObjectId),
    DOB: joi.date().less('now'),
    gender: joi.string().valid(...Object.values(genderTypes)),
    address: joi.string(),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    fileObj,
    file: joi.object().keys(fileObj),
    currentPrice: joi.string(),
    model: joi.string(),
    basePrice: joi.string(),
};

export const validation = (schema) => {
    return (req, res, next) => {
        const inputs = { ...req.body, ...req.query, ...req.params };
        if (req.file || req.files?.length) {
            inputs.file = req.files || req.file;
        }

        const validationResults = schema.validate(inputs, {
            abortEarly: false,
        });
        if (validationResults.error) {
            return res.status(400).json({
                Mesg: 'validation error',
                details: validationResults.error.details,
            });
        }
        return next();
    };
};
