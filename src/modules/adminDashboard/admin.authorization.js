import { roleTypes } from '../../DB/models/user.model.js';

export const endPoint = {
    getDashdoard: [roleTypes.admin, roleTypes.superAdmin],
};
