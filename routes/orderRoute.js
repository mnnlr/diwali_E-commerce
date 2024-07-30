import { Router } from "express";
const router = Router();


import { isAuthenticated } from "../middleware/auth/isAuthenticare.js";
import { paymentDetails, svaeOrderDetails } from "../controllers/OrderController.js";


router.route('/saveorder').post(isAuthenticated, svaeOrderDetails);
router.route('/make-payment').post(isAuthenticated, paymentDetails);

export default router;