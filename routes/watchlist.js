import express from 'express';

const router = express.Router();

import { getWishLists,addToWishList,removeFromWishList } from '../controllers/wishListController.js';

import { isAuthenticated } from '../middleware/auth/isAuthenticare.js';

router.route('/').get(isAuthenticated,getWishLists).put(isAuthenticated,addToWishList).delete(isAuthenticated,removeFromWishList);

export default router;
