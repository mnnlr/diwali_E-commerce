import { Router } from "express";
const router = Router();


import { addtocartController } from "../controller/addtoCartController.js";

router.route('/').put(addtocartController);
router.route('/').get(addtocartController);
router.route('/').delete(addtocartController);
    
export default router;  