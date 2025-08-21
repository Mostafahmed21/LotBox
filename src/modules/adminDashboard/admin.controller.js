import { Router } from 'express';
import * as AS from './service/admin.service.js';
import {
    authentication,
    authorization,
} from '../../middlewares/auth.middleware.js';
import { endPoint } from './admin.authorization.js';
const router = Router({
    mergeParams: true,
});

router.get(
    '/dashboard',
    authentication(),
    authorization(endPoint.getDashdoard),
    AS.getDashboard,
);
router.patch(
    '/:userId/profile/dashboard/role',
    authentication(),
    authorization(endPoint.getDashdoard),
    AS.changeRoles,
);

export default router;
