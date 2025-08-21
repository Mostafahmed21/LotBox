import Router from 'express';
import { authentication } from '../../middlewares/auth.middleware.js';
import * as US from './service/user.service.js';
import * as validators from './user.validation.js';
import { validation } from '../../middlewares/validation.middleware.js';
import adminController from '../adminDashboard/admin.controller.js';
const router = Router({
    mergeParams: true,
});

router.use('/adminDashboard', adminController);

router.get('/profile', authentication(), US.getProfile);
router.patch(
    '/profile/updateProfile',
    validation(validators.updateProfileSchema),
    authentication(),
    US.updateProfile,
);
router.patch(
    '/profile/updatePassword',
    validation(validators.updatePasswordSchema),
    authentication(),
    US.updatePassword,
);

export default router;
