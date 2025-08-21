import { Router } from 'express';
import * as RS from './service/regestration.service.js';
import * as LS from './service/login.service.js';
import { authentication } from './../../middlewares/auth.middleware.js';
import { validation } from './../../middlewares/validation.middleware.js';
import * as validators from './auth.validation.js';
const router = Router();

router.post('/signUp', validation(validators.signUpSchema), RS.signUP);
router.patch(
    '/confirmEmail',
    validation(validators.confirmEmailSchema),
    RS.confirmEmail,
);
router.post('/login', validation(validators.loginSchema), LS.login);
router.patch(
    '/forgot-password',
    validation(validators.forgotPasswordSchema),
    LS.forgetPassword,
);
router.patch(
    '/reset-password',
    validation(validators.resetPasswordSchema),
    authentication(),
    LS.resetPassword,
);

export default router;
