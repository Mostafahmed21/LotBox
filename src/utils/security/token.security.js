import jwt from 'jsonwebtoken';
import * as dbSerevice from '../../DB/dbService.js';
import { userModel } from '../../DB/models/user.model.js';

export const tokenTypes = {
    access: 'access',
};

export const decodedToken = async ({
    authorization = '',
    tokenType = tokenTypes.access,
    next = {},
}) => {
    const [bearer, token] = authorization?.split(' ') || [];
    if (!bearer || !token) {
        return next(new Error('misssing token', { cause: 400 }));
    }
    let access_signature = ' ';
    switch (bearer) {
        case 'System':
            access_signature = process.env.ADMIN_ACCESS_TOKEN;
            break;
        case 'Bearer':
            access_signature = process.env.USER_ACCSESS_TOKEN;
            break;
        default:
            break;
    }
    const decoded = verifyToken({
        token,
        signature:
            tokenType == tokenTypes.access
                ? access_signature
                : 'In-valid signature',
    });
    if (!decoded?.id) {
        return next(new Error('In-valid token', { cause: 401 }));
    }
    const user = await dbSerevice.findOne({
        model: userModel,
        filter: { _id: decoded.id, isDeleted: { $exists: false } },
    });
    if (!user) {
        return next(new Error('not regestered', { cause: 404 }));
    }
    if (user.changeCredentialsTime?.getTime() >= decoded.iat * 1000) {
        return next(new Error('In-valid login credentials', { cause: 400 }));
    }
    return user;
};
export const generateToken = ({
    payload = {},
    signature = process.env.USER_ACCESS_TOKEN,
    expiresIn = process.env.EXPIREIN,
}) => {
    const token = jwt.sign(payload, signature, {
        expiresIn: parseInt(expiresIn),
    });
    return token;
};

export const verifyToken = ({
    token,
    signature = process.env.USER_ACCESS_TOKEN,
}) => {
    const decoded = jwt.verify(token, signature);
    return decoded;
};
