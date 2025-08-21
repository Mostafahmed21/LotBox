import { asyncHandler } from '../../../utils/response/error.response.js';
import * as dbservice from '../../../DB/dbService.js';
import { roleTypes, userModel } from '../../../DB/models/user.model.js';
import { objectModel } from '../../../DB/models/object.model.js';
import successResponse from '../../../utils/response/sucess.response.js';

export const getDashboard = asyncHandler(async (req, res, next) => {
    let users = await Promise.allSettled([
        await dbservice.find({
            model: userModel,
            filter: {
                isDeleted: { $exists: false },
            },
            select: 'name phone',
        }),
        dbservice.find({
            model: objectModel,
            filter: {},
            populate: [
                {
                    path: 'auctions',
                    match: { isDeleted: { $exists: false } },
                    select: 'price createdBy ',
                    populate: [
                        {
                            path: 'createdBy',
                            select: 'name phone',
                        },
                    ],
                },
            ],
        }),
    ]);
    return successResponse({ res, status: 200, data: { users } });
});

export const changeRoles = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { role } = req.body;
    if (req.user.role === roleTypes.user) {
        return next(
            new Error('you are not allowed to change roles', { cause: 403 }),
        );
    }
    let filter = {
        _id: userId,
        isDeleted: { $exists: false },
    };

    if (req.user.role === roleTypes.superAdmin) {
        filter.role = { $ne: roleTypes.superAdmin };
    } else if (req.user.role === roleTypes.admin) {
        filter.role = roleTypes.user;
    }
    const user = await dbservice.findOneAndUpdate({
        model: userModel,
        filter,
        data: {
            role,
            updatedBy: req.user.id,
        },
        options: {
            new: true,
        },
    });

    if (!user) {
        return next(new Error('user not found', { cause: 400 }));
    }

    return successResponse({ res, status: 200, data: { user } });
});
