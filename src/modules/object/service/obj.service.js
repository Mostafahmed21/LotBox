import { cloud } from '../../../utils/multer/cloudinary.multer.js';
import { asyncHandler } from '../../../utils/response/error.response.js';
import * as dbservice from '../../../DB/dbService.js';
import { objectModel } from '../../../DB/models/object.model.js';
import successResponse from '../../../utils/response/sucess.response.js';
import { roleTypes } from '../../../DB/models/user.model.js';
import { auctionModel } from '../../../DB/models/auction.model.js';

export const getObjects = asyncHandler(async (req, res, next) => {
    const objects = await dbservice.find({
        model: objectModel,
        filter: { isDeleted: { $exists: false } },
        select: '-__v -updatedAt -changeCredentialsTime -bidders',
        populate: [
            {
                path: 'createdBy',
                select: 'name',
            },
            {
                path: 'auctions',
                match: { isDeleted: { $exists: false } },
                select: 'price createdBy createdAt',
                populate: [
                    {
                        path: 'createdBy',
                        select: 'name phone',
                    },
                ],
            },
        ],
    });
    return successResponse({ res, status: 200, data: { objects } });
});

export const createObject = asyncHandler(async (req, res, next) => {
    let attachments = [];
    for (const file of req.files) {
        const { secure_url, public_id } = await cloud.uploader.upload(
            file.path,
            {
                folder: `${process.env.APP_NAME}/Object`,
            },
        );
        attachments.push({ secure_url, public_id });
    }
    const object = await dbservice.create({
        model: objectModel,
        data: {
            ...req.body,
            attachments,
            createdBy: req.user.id,
        },
    });
    return successResponse({ res, status: 201, data: { object } });
});

export const updateObject = asyncHandler(async (req, res, next) => {
    let attachments = [];
    if (req.files.length) {
        for (const file of req.files) {
            const { secure_url, public_id } = await cloud.uploader.upload(
                file.path,
                {
                    folder: `${process.env.APP_NAME}/Object`,
                },
            );
            attachments.push({ secure_url, public_id });
        }
        req.body.attachments = attachments;
    }
    const object = await dbservice.findOneAndUpdate({
        model: objectModel,
        filter: {
            _id: req.params.objectId,
            isDeleted: { $exists: false },
            createdBy: req.user.id,
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
    return object
        ? successResponse({ res, status: 201, data: { object } })
        : next(new Error('object not found or deleted ', { cause: 404 }));
});

export const freezeObject = asyncHandler(async (req, res, next) => {
    const role =
        req.user.role === roleTypes.admin ||
        req.user.role === roleTypes.superAdmin
            ? {}
            : { createdBy: req.user.id };
    const object = await dbservice.findOneAndUpdate({
        model: objectModel,
        filter: {
            _id: req.params.objectId,
            isDeleted: { $exists: false },
            ...role,
        },
        data: {
            isDeleted: Date.now(),
            updatedBy: req.user.id,
            DeletedBy: req.user.id,
            changeCredentialsTime: Date.now(),
        },
        options: {
            new: true,
        },
    });
    return object
        ? successResponse({ res, status: 201, data: { object } })
        : next(
              new Error(
                  'object not found object not found  or you can not freeze this object ',
                  { cause: 404 },
              ),
          );
});

export const unFreezeObject = asyncHandler(async (req, res, next) => {
    const object = await dbservice.findOneAndUpdate({
        model: objectModel,
        filter: {
            _id: req.params.objectId,
            isDeleted: { $exists: true },
            DeletedBy: req.user.id,
        },
        data: {
            $unset: {
                isDeleted: 0,
                DeletedBy: 0,
            },
            updatedBy: req.user.id,
            changeCredentialsTime: Date.now(),
        },
        options: { new: true },
    });
    return successResponse({ res, status: 201 });
});

export const saledObject = asyncHandler(async (req, res, next) => {
    const { objectId } = req.params;
    const role =
        req.user.role === roleTypes.admin ||
        req.user.role === roleTypes.superAdmin
            ? {}
            : { createdBy: req.user.id };
    const object = await dbservice.findOne({
        model: objectModel,
        filter: {
            _id: objectId,
            isDeleted: { $exists: false },
            ...role,
        },
    });
    if (
        !object ||
        (req.user.role !== roleTypes.admin &&
            req.user.role !== roleTypes.superAdmin &&
            (!object.createdBy ||
                object.createdBy.toString() !== req.user.id.toString()))
    ) {
        return next(
            new Error(
                ' object not found or Not authorized to edit this object',
                {
                    cause: 403,
                },
            ),
        );
    }
    const auctions = await dbservice.find({
        model: auctionModel,
        filter: {
            objectId: objectId,
            isDeleted: { $exists: false },
        },
    });
    if (!auctions.length) {
        return next(new Error('no auction for this object', { cause: 404 }));
    }
    const highestAuction = auctions.reduce((max, now) => {
        return parseFloat(now.price) > parseFloat(max.price) ? now : max;
    });
    if (!highestAuction)
        return next(new Error('no auction for this object', { cause: 404 }));
    const newObject = await dbservice.findOneAndUpdate({
        model: objectModel,
        filter: {
            _id: objectId,
            isDeleted: { $exists: false },
            ...role,
        },
        data: {
            isDeleted: Date.now(),
            DeletedBy: req.user.id,
            changeCredentialsTime: Date.now(),
            newOwner: highestAuction.createdBy,
            permanentDeleteAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        options: {
            new: true,
        },
    });
    return successResponse({ res, status: 201, data: { object: newObject } });
});
