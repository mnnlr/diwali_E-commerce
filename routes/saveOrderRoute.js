import { Router } from "express";
const router = Router();


import saveOrderDetails from "../controller/saveOrderController.js";

router.route('/').post(saveOrderDetails);


export default router;