import joi from 'joi';
import { generalFields } from '../../middlewares/validation.middleware.js';

export const createObjectSchema = joi
    .object()
    .keys({
        description: joi.string().min(3).max(5000),
        file: joi.array().items(generalFields.file),
        name: generalFields.name,
        model: generalFields.model,
        currentPrice: generalFields.currentPrice,
    })
    .or('file', 'description');

export const updateObjectSchema = joi
    .object()
    .keys({
        description: joi.string().min(3).max(5000),
        file: joi.array().items(generalFields.file),
        currentPrice: generalFields.currentPrice,
        objectId: generalFields.id.required(),
    })
    .or('file', 'description', 'currentPrice');

export const freezeObjectSchema = joi.object().keys({
    objectId: generalFields.id.required(),
});
