import { Router } from "express";
const router = Router();


import { CheckoutPayment } from "../controller/paymentController.js";
import { isAuthenticated } from "../middleware/authenticate.js";

router.route('/').post(isAuthenticated, CheckoutPayment);

export default router;