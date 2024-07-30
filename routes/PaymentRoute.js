import { Router } from "express";
const router = Router();


import { CheckoutPayment } from "../controllers/PaymentController.js";
import { isAuthenticated } from "../middleware/auth/isAuthenticare.js";

router.route('/').post(isAuthenticated, CheckoutPayment);

export default router;