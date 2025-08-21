import joi from 'joi';
import { generalFields } from '../../middlewares/validation.middleware.js';

export const createAuctionSchema = joi.object().keys({
    price: generalFields.basePrice.required(),
    objectId: generalFields.id,
});

export const updateAuctionSchema = joi.object().keys({
    price: generalFields.basePrice.required(),
    objectId: generalFields.id.required(),
    auctionId: generalFields.id.required(),
});

export const freezeAuctionSchema = joi.object().keys({
    objectId: generalFields.id.required(),
    auctionId: generalFields.id.required(),
});
