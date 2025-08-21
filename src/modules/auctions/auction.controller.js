import { Router } from 'express';
import {
    authentication,
    authorization,
} from '../../middlewares/auth.middleware.js';
import * as validators from './auction.validation.js';
import { validation } from '../../middlewares/validation.middleware.js';
import * as AS from './service/auctions.service.js';
import { endPoint } from './auction.authorization.js';

const router = Router({
    mergeParams: true,
});

router.post(
    '/',
    authentication(),
    authorization(endPoint.createAuction),
    validation(validators.createAuctionSchema),
    AS.createAuction,
);

router.patch(
    '/:auctionId',
    authentication(),
    authorization(endPoint.updateAuction),
    validation(validators.updateAuctionSchema),
    AS.updateAuction,
);

router.delete(
    '/:auctionId/freeze',
    authentication(),
    authorization(endPoint.freezeAuction),
    validation(validators.freezeAuctionSchema),
    AS.freezeAuction,
);

export default router;
