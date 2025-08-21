import { asyncHandler } from '../../../utils/response/error.response.js';
import * as dbservice from '../../../DB/dbService.js';
import { roleTypes, userModel } from '../../../DB/models/user.model.js';
import {
    compareHash,
    generatHash,
} from '../../../utils/security/hash.security.js';
import { generateToken } from '../../../utils/security/token.security.js';
import successResponse from '../../../utils/response/sucess.response.js';
import { eventEmitter } from '../../../utils/events/email.events.js';

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await dbservice.findOne({
        model: userModel,
        filter: {
            email,
            confirmEmail: true,
        },
    });
    if (!user) {
        return next(
            new Error('user not found or  not confirmed', { cause: 401 }),
        );
    }
    const comparePassword = compareHash({
        plainText: password,
        hashValue: user.password,
    });
    if (!comparePassword) {
        return next(new Error('In-valid password', { cause: 401 }));
    }
    const access_token = generateToken({
        payload: {
            id: user._id,
            email: user.email,
            name: user.name,
        },
        signature: [roleTypes.admin, roleTypes.superAdmin].includes(user.role)
            ? process.env.ADMIN_ACCESS_TOKEN
            : process.env.USER_ACCESS_TOKEN,
    });
    return successResponse({
        res,
        status: 201,
        data: { access_token: access_token },
    });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await dbservice.findOne({
        model: userModel,
        filter: {
            email,
            isDeleted: { $exists: false },
        },
    });
    if (!user) {
        return next(new Error('user not found or deleted', { cause: 404 }));
    }
    eventEmitter.emit('forgot-password', { id: user._id, email });
    return successResponse({ res, message: 'check your inbox' });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { code, password } = req.body;
    const user = await dbservice.findOne({
        model: userModel,
        filter: {
            _id: req.user.id,
            isDeleted: { $exists: false },
        },
    });
    if (!user) {
        return next(new Error('user not found or deleted', { cause: 404 }));
    }
    const compareCode = compareHash({
        plainText: code,
        hashValue: user.resetPasswordOtp,
    });
    if (!compareCode) {
        return next(new Error('In-valid code', { cause: 404 }));
    }
    const hashPassword = generatHash({ plainText: password });
    const newUser = await dbservice.findOneAndUpdate({
        model: userModel,
        filter: {
            _id: req.user.id,
        },
        data: {
            password: hashPassword,
            $unset: { resetPasswordOtp: 0 },
            changeCredentialsTime: Date.now(),
        },
        options: { new: true },
    });
    return successResponse({ res, status: 200, data: { newUser } });
});
