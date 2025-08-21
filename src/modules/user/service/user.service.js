import { asyncHandler } from '../../../utils/response/error.response.js';
import * as dbservice from '../../../DB/dbService.js';
import { userModel } from '../../../DB/models/user.model.js';
import successResponse from '../../../utils/response/sucess.response.js';
import {
    compareHash,
    generatHash,
} from '../../../utils/security/hash.security.js';

export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await dbservice.findOne({
        model: userModel,
        filter: {
            _id: req.user.id,
            isDeleted: { $exists: false },
        },
    });
    return successResponse({ res, status: 200, data: { user } });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    const user = await dbservice.findOneAndUpdate({
        model: userModel,
        filter: {
            _id: req.user.id,
        },
        data: req.body,
        options: { new: true },
    });
    return successResponse({ res, status: 200, data: { user } });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, password } = req.body;
    if (
        !compareHash({ plainText: oldPassword, hashValue: req.user.password })
    ) {
        return next(new Error('old password is not correct', { cause: 404 }));
    }
    const user = await dbservice.updateOne({
        model: userModel,
        filter: {
            _id: req.user.id,
        },
        data: {
            password: generatHash({ plainText: password }),
            changeCredentialsTime: Date.now(),
        },
        options: {
            new: true,
        },
    });
    return successResponse({ res, status: 200, data: { user } });
});
