import express from 'express';

const router = express.Router();

import { addToCart,getCart,removeFromCart,updateCart } from '../controllers/CartController.js';

import { isAuthenticated } from '../middleware/auth/isAuthenticare.js';

router.route('/').get(isAuthenticated,getCart).post(isAuthenticated,addToCart).put(isAuthenticated,updateCart).delete(isAuthenticated,removeFromCart);

export default router;
