import { roleTypes } from '../../DB/models/user.model.js';

export const endPoint = {
    createAuction: [roleTypes.user],
    updateAuction: [roleTypes.user],
    freezeAuction: [roleTypes.user, roleTypes.admin, roleTypes.superAdmin],
};
