import { roleTypes } from '../../DB/models/user.model.js';

export const endPoint = {
    createObj: [roleTypes.user],
    freezeObj: [roleTypes.admin, roleTypes.user, roleTypes.superAdmin],
};
