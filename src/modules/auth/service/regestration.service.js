import { asyncHandler } from '../../../utils/response/error.response.js';
import * as dbservice from '../../../DB/dbService.js';
import { userModel } from '../../../DB/models/user.model.js';
import {
    compareHash,
    generatHash,
} from '../../../utils/security/hash.security.js';
import { eventEmitter } from '../../../utils/events/email.events.js';
import successResponse from '../../../utils/response/sucess.response.js';

export const signUP = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (await dbservice.findOne({ model: userModel, filter: { email } })) {
        return next(new Error('email already exists', { cause: 409 }));
    }
    const hashPassword = generatHash({ plainText: password });
    const user = await dbservice.create({
        model: userModel,
        data: {
            name,
            email,
            password: hashPassword,
        },
    });
    eventEmitter.emit('sendConfirmEmail', { id: user._id, email });
    return successResponse({ res, status: 201, data: { user } });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body;
    const user = await dbservice.findOne({
        model: userModel,
        filter: { email },
    });
    if (!user) {
        return next(new Error('email not found', { cause: 409 }));
    }
    if (user.confirmEmail) {
        return next(new Error('email already confirmed', { cause: 409 }));
    }
    const compare = compareHash({
        plainText: code,
        hashValue: user.confirmEmailOtp,
    });
    if (!compare) {
        return next(new Error('In-valid code', { cause: 400 }));
    }
    const newUser = await dbservice.updateOne({
        model: userModel,
        filter: { email },
        data: {
            confirmEmail: true,
            $unset: { confirmEmailOtp: 0 },
        },
        options: { new: true },
    });
    return successResponse({ res, status: 200, data: { newUser } });
});
