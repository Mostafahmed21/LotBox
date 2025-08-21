import { asyncHandler } from '../../../utils/response/error.response.js';
import * as dbservice from '../../../DB/dbService.js';
import { objectModel } from '../../../DB/models/object.model.js';
import { auctionModel } from '../../../DB/models/auction.model.js';
import successResponse from '../../../utils/response/sucess.response.js';

export const createAuction = asyncHandler(async (req, res, next) => {
    const { objectId } = req.params;
    const object = await dbservice.findOne({
        model: objectModel,
        filter: {
            _id: objectId,
            isDeleted: { $exists: false },
        },
    });
    if (!object) {
        return next(new Error('object not found or deleted', { cause: 404 }));
    }
    if (req.user.id.toString() === object.createdBy.toString()) {
        return next(
            new Error('you can not create auction for your own object', {
                cause: 400,
            }),
        );
    }
    if (
        parseInt(req.body.price) <= parseInt(object.currentPrice) ||
        parseInt(req.body.price) === 0
    ) {
        return next(
            new Error('price should be greater than current price ', {
                cause: 400,
            }),
        );
    }
    if (object.bidders?.includes(req.user.id)) {
        return next(
            new Error('you are already a bidder in this object', {
                cause: 400,
            }),
        );
    }
    const auction = await dbservice.create({
        model: auctionModel,
        data: {
            ...req.body,
            objectId,
            createdBy: req.user.id,
        },
    });
    const newObject = await dbservice.findOneAndUpdate({
        model: objectModel,
        filter: {
            _id: objectId,
            isDeleted: { $exists: false },
        },
        data: {
            basePrice: req.body.price,
            $addToSet: {
                bidders: req.user.id,
            },
            changeCredentialsTime: Date.now(),
        },
        options: {
            new: true,
            populate: [
                {
                    path: 'bidders',
                    select: 'name  ',
                },
            ],
            select: 'basePrice',
        },
    });

    return successResponse({
        res,
        status: 201,
        data: { auction, object: newObject },
    });
});

export const updateAuction = asyncHandler(async (req, res, next) => {
    const { auctionId, objectId } = req.params;
    const auction = await dbservice.findOne({
        model: auctionModel,
        filter: {
            _id: auctionId,
            objectId,
            createdBy: req.user.id,
            isDeleted: { $exists: false },
        },
    });
    if (!auction) {
        return next(new Error('auction not found or deleted', { cause: 404 }));
    }
    if (req.user.id.toString() !== auction.createdBy.toString()) {
        return next(
            new Error('you are not allowed to update this auction', {
                cause: 403,
            }),
        );
    }
    if (
        parseInt(req.body.price) <= parseInt(auction.price) ||
        parseInt(req.body.price) < parseInt(auction.objectId.basePrice)
    ) {
        return next(
            new Error(
                'price should be greater than current price or base price',
                {
                    cause: 400,
                },
            ),
        );
    }
    const newAuction = await dbservice.findOneAndUpdate({
        model: auctionModel,
        filter: {
            _id: auctionId,
            objectId,
            createdBy: req.user.id,
            isDeleted: { $exists: false },
        },
        data: {
            ...req.body,
            updatedBy: req.user.id,
            changeCredentialsTime: Date.now(),
        },
        options: {
            new: true,
        },
    });
    const newObject = await dbservice.updateOne({
        model: objectModel,
        filter: {
            _id: objectId,
            isDeleted: { $exists: false },
        },
        data: {
            basePrice: req.body.price,
            changeCredentialsTime: Date.now(),
        },
        options: {
            new: true,
        },
    });
    return successResponse({ res, status: 200, data: { auction: newAuction } });
});

export const freezeAuction = asyncHandler(async (req, res, next) => {
    const { auctionId, objectId } = req.params;
    const auction = await dbservice.findOne({
        model: auctionModel,
        filter: {
            _id: auctionId,
            objectId,
            createdBy: req.user.id,
            isDeleted: { $exists: false },
        },
    });
    if (
        !auction ||
        (auction.createdBy.toString() != req.user.id.toString() &&
            auction.objectId.createdBy.toString() != req.user.id.toString() &&
            req.user.role !== roleTypes.admin &&
            req.user.role !== roleTypes.superAdmin)
    ) {
        return next(
            new Error('you are not allowed to freeze this auction', {
                cause: 404,
            }),
        );
    }
    const newAuction = await dbservice.findOneAndUpdate({
        model: auctionModel,
        filter: {
            _id: auctionId,
            objectId,
            createdBy: req.user.id,
            isDeleted: { $exists: false },
        },
        data: {
            isDeleted: Date.now(),
            changeCredentialsTime: Date.now(),
            deletedBy: req.user.id,
        },
        options: {
            new: true,
        },
    });
    return successResponse({ res, status: 200, data: { auction: newAuction } });
});



