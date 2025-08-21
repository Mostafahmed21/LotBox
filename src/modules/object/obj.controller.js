import { Router } from 'express';
import {
    authentication,
    authorization,
} from '../../middlewares/auth.middleware.js';
import * as OS from './service/obj.service.js';
import * as validators from './obj.validation.js';
import { validation } from '../../middlewares/validation.middleware.js';
import { endPoint } from './obj.authorization.js';
import { fileTypes, uploadCloudFile } from '../../utils/multer/cloud.multer.js';
import auctionController from '../../modules/auctions/auction.controller.js';

const router = Router({
    mergeParams: true,
});

router.use('/:objectId/auction', auctionController);

router.get('/', authentication(), OS.getObjects);

router.post(
    '/create',
    authentication(),
    authorization(endPoint.createObj),
    uploadCloudFile(fileTypes.image).array('attachment', 3),
    validation(validators.createObjectSchema),
    OS.createObject,
);

router.patch(
    '/update/:objectId',
    authentication(),
    authorization(endPoint.createObj),
    uploadCloudFile(fileTypes.image).array('attachment', 3),
    validation(validators.updateObjectSchema),
    OS.updateObject,
);

router.delete(
    '/freeze/:objectId',
    authentication(),
    authorization(endPoint.freezeObj),
    validation(validators.freezeObjectSchema),
    OS.freezeObject,
);

router.patch(
    '/unfreeze/:objectId',
    authentication(),
    authorization(endPoint.freezeObj),
    validation(validators.freezeObjectSchema),
    OS.unFreezeObject,
);

router.delete(
    '/:objectId/sale',
    authentication(),
    authorization(endPoint.freezeObj),
    validation(validators.freezeObjectSchema),
    OS.saledObject,
);

export default router;
